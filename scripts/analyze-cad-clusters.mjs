import { readFileSync } from "node:fs";

const [, , inputPath] = process.argv;

if (!inputPath) {
  console.error("Usage: node scripts/analyze-cad-clusters.mjs input.min.json");
  process.exit(1);
}

const source = readFileSync(inputPath, "utf8").replace(/\bnan\b/g, "null");
const drawing = JSON.parse(source);

function handleKey(handle) {
  return Array.isArray(handle) ? String(handle.at(-1)) : "";
}

function layerHandleKey(layerRef) {
  return Array.isArray(layerRef) ? String(layerRef.at(-1)) : "";
}

function normalizeLayerName(name) {
  return String(name ?? "")
    .toLowerCase()
    .replaceAll("�", "ä")
    .replaceAll("ae", "ä");
}

function shouldRenderLayer(name) {
  const layer = normalizeLayerName(name);
  if (!layer || layer === "0") return false;
  const excluded = [
    "beschrift",
    "text",
    "bem",
    "fahrr",
    "fliesen",
    "geländer",
    "entw",
    "verdeckt",
    "ansicht",
    "stahl",
    "marki",
    "nachbar",
    "fassade",
    "putz",
    "aufzug",
    "aussenhaut",
    "außenhaut",
    "platten",
    "uprofil",
  ];
  if (excluded.some((fragment) => layer.includes(fragment))) return false;
  const included = [
    "wand",
    "wände",
    "wändebestand",
    "wändeneu",
    "schrwand",
    "schrbestand",
    "tür",
    "treppen",
    "fenster",
    "sani",
    "moeb",
    "glas",
  ];
  return included.some((fragment) => layer.includes(fragment));
}

function boundsForPoints(points) {
  const bounds = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
  for (const point of points) {
    if (!Array.isArray(point)) continue;
    const [x, y] = point;
    if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
    bounds.minX = Math.min(bounds.minX, x);
    bounds.minY = Math.min(bounds.minY, y);
    bounds.maxX = Math.max(bounds.maxX, x);
    bounds.maxY = Math.max(bounds.maxY, y);
  }
  return bounds;
}

function mergeBounds(target, sourceBounds) {
  target.minX = Math.min(target.minX, sourceBounds.minX);
  target.minY = Math.min(target.minY, sourceBounds.minY);
  target.maxX = Math.max(target.maxX, sourceBounds.maxX);
  target.maxY = Math.max(target.maxY, sourceBounds.maxY);
}

function intersects(a, b, margin) {
  return !(
    a.maxX + margin < b.minX ||
    b.maxX + margin < a.minX ||
    a.maxY + margin < b.minY ||
    b.maxY + margin < a.minY
  );
}

function format(value) {
  return Number(value).toFixed(2);
}

const layers = new Map();
for (const object of drawing.OBJECTS ?? []) {
  if (object.object === "LAYER") layers.set(handleKey(object.handle), object.name ?? "");
}

const elements = [];
for (const object of drawing.OBJECTS ?? []) {
  if (object.object || object.invisible) continue;
  const layerName = layers.get(layerHandleKey(object.layer)) ?? "";
  if (!shouldRenderLayer(layerName)) continue;

  let points = [];
  if (Array.isArray(object.start) && Array.isArray(object.end)) {
    points = [object.start, object.end];
  } else if (Array.isArray(object.points)) {
    points = object.points.filter((point) => Array.isArray(point));
  } else if (Array.isArray(object.center) && Number.isFinite(object.radius)) {
    points = [
      [object.center[0] - object.radius, object.center[1] - object.radius],
      [object.center[0] + object.radius, object.center[1] + object.radius],
    ];
  }

  if (!points.length) continue;
  const bounds = boundsForPoints(points);
  if (!Number.isFinite(bounds.minX)) continue;
  const width = bounds.maxX - bounds.minX;
  const height = bounds.maxY - bounds.minY;
  if (width > 95 || height > 95) continue;
  elements.push({ bounds, layerName });
}

const components = [];
const margin = 3.25;

for (const element of elements) {
  const touching = [];
  for (let index = 0; index < components.length; index += 1) {
    if (intersects(element.bounds, components[index].bounds, margin)) touching.push(index);
  }

  if (!touching.length) {
    components.push({
      count: 1,
      bounds: { ...element.bounds },
      layers: new Map([[element.layerName, 1]]),
    });
    continue;
  }

  const first = components[touching[0]];
  first.count += 1;
  mergeBounds(first.bounds, element.bounds);
  first.layers.set(element.layerName, (first.layers.get(element.layerName) ?? 0) + 1);

  for (let i = touching.length - 1; i >= 1; i -= 1) {
    const component = components[touching[i]];
    first.count += component.count;
    mergeBounds(first.bounds, component.bounds);
    for (const [layerName, count] of component.layers) {
      first.layers.set(layerName, (first.layers.get(layerName) ?? 0) + count);
    }
    components.splice(touching[i], 1);
  }
}

const ranked = components
  .filter((component) => component.count > 30)
  .sort((a, b) => b.count - a.count)
  .slice(0, 20);

for (const [index, component] of ranked.entries()) {
  const width = component.bounds.maxX - component.bounds.minX;
  const height = component.bounds.maxY - component.bounds.minY;
  const topLayers = Array.from(component.layers.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => `${name}:${count}`)
    .join(", ");

  console.log(
    `${index + 1}. count=${component.count} bbox=${format(component.bounds.minX)},${format(component.bounds.minY)},${format(width)},${format(height)} layers=${topLayers}`,
  );
}
