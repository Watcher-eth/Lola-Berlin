import { readFileSync, writeFileSync } from "node:fs";

const [, , inputPath, outputPath, title = "CAD floor plan", cropArg] = process.argv;

if (!inputPath || !outputPath) {
  console.error("Usage: node scripts/generate-cad-layered-svg.mjs input.min.json output.svg [title]");
  process.exit(1);
}

const source = readFileSync(inputPath, "utf8").replace(/\bnan\b/g, "null");
const drawing = JSON.parse(source);

const cropValues = cropArg?.split(",").map((value) => Number(value.trim()));
const cropBounds =
  cropValues?.length === 4 && cropValues.every(Number.isFinite)
    ? {
        minX: cropValues[0],
        minY: cropValues[1],
        maxX: cropValues[0] + cropValues[2],
        maxY: cropValues[1] + cropValues[3],
        width: cropValues[2],
        height: cropValues[3],
      }
    : null;

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

function formatNumber(value) {
  return Number(value).toFixed(3).replace(/\.?0+$/, "");
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function pointsToPath(points, close = false) {
  if (!Array.isArray(points) || points.length === 0) return "";
  const [first, ...rest] = points;
  if (!Array.isArray(first)) return "";
  const commands = [`M ${formatNumber(first[0])} ${formatNumber(first[1])}`];
  for (const point of rest) {
    if (Array.isArray(point)) commands.push(`L ${formatNumber(point[0])} ${formatNumber(point[1])}`);
  }
  if (close) commands.push("Z");
  return commands.join(" ");
}

function collectPoint(bounds, x, y) {
  if (!Number.isFinite(x) || !Number.isFinite(y)) return;
  bounds.minX = Math.min(bounds.minX, x);
  bounds.minY = Math.min(bounds.minY, y);
  bounds.maxX = Math.max(bounds.maxX, x);
  bounds.maxY = Math.max(bounds.maxY, y);
}

function boundsForPoints(points) {
  const pointBounds = {
    minX: Infinity,
    minY: Infinity,
    maxX: -Infinity,
    maxY: -Infinity,
  };
  for (const point of points) {
    if (Array.isArray(point)) collectPoint(pointBounds, point[0], point[1]);
  }
  return pointBounds;
}

function intersectsBounds(a, b, margin = 0) {
  return !(
    a.maxX + margin < b.minX ||
    b.maxX + margin < a.minX ||
    a.maxY + margin < b.minY ||
    b.maxY + margin < a.minY
  );
}

function shouldKeepBounds(pointBounds) {
  if (!cropBounds) return true;
  if (!intersectsBounds(pointBounds, cropBounds, 1.5)) return false;

  const width = pointBounds.maxX - pointBounds.minX;
  const height = pointBounds.maxY - pointBounds.minY;
  return width <= cropBounds.width * 1.35 && height <= cropBounds.height * 1.35;
}

const layers = new Map();
for (const object of drawing.OBJECTS ?? []) {
  if (object.object === "LAYER") {
    layers.set(handleKey(object.handle), object.name ?? "");
  }
}

const pathsByLayer = new Map();
const circlesByLayer = new Map();
const layerStats = new Map();
const bounds = {
  minX: Infinity,
  minY: Infinity,
  maxX: -Infinity,
  maxY: -Infinity,
};

function addPath(layerName, path, points) {
  if (!path) return;
  const pointBounds = boundsForPoints(points);
  if (!Number.isFinite(pointBounds.minX) || !shouldKeepBounds(pointBounds)) return;

  if (!pathsByLayer.has(layerName)) pathsByLayer.set(layerName, []);
  pathsByLayer.get(layerName).push(path);

  const current = layerStats.get(layerName) ?? { entities: 0, segments: 0 };
  current.entities += 1;
  current.segments += Math.max(1, points.length - 1);
  layerStats.set(layerName, current);

  for (const point of points) {
    if (Array.isArray(point)) collectPoint(bounds, point[0], point[1]);
  }
}

function addCircle(layerName, center, radius) {
  if (!Array.isArray(center) || !Number.isFinite(radius) || radius <= 0) return;
  const pointBounds = {
    minX: center[0] - radius,
    minY: center[1] - radius,
    maxX: center[0] + radius,
    maxY: center[1] + radius,
  };
  if (!shouldKeepBounds(pointBounds)) return;

  if (!circlesByLayer.has(layerName)) circlesByLayer.set(layerName, []);
  circlesByLayer.get(layerName).push({ center, radius });
  collectPoint(bounds, center[0] - radius, center[1] - radius);
  collectPoint(bounds, center[0] + radius, center[1] + radius);
}

for (const object of drawing.OBJECTS ?? []) {
  if (object.object || object.invisible) continue;

  const layerName = layers.get(layerHandleKey(object.layer)) ?? "";
  if (!shouldRenderLayer(layerName)) continue;

  if (Array.isArray(object.start) && Array.isArray(object.end)) {
    addPath(layerName, pointsToPath([object.start, object.end]), [object.start, object.end]);
    continue;
  }

  if (Array.isArray(object.points)) {
    const points = object.points.filter((point) => Array.isArray(point));
    const first = points[0];
    const last = points.at(-1);
    const isClosed =
      Boolean(object.flag && (object.flag & 1)) ||
      (first &&
        last &&
        Math.abs(first[0] - last[0]) < 0.0001 &&
        Math.abs(first[1] - last[1]) < 0.0001);
    addPath(layerName, pointsToPath(points, isClosed), points);
    continue;
  }

  if (Array.isArray(object.center) && Number.isFinite(object.radius)) {
    addCircle(layerName, object.center, object.radius);
  }
}

if (!Number.isFinite(bounds.minX) || !Number.isFinite(bounds.minY) || !Number.isFinite(bounds.maxX) || !Number.isFinite(bounds.maxY)) {
  console.error("No drawable layer-filtered CAD geometry found.");
  process.exit(1);
}

const outputBounds = cropBounds ?? bounds;
const width = outputBounds.maxX - outputBounds.minX;
const height = outputBounds.maxY - outputBounds.minY;
const padding = Math.max(width, height) * 0.02;
const viewBox = [
  formatNumber(outputBounds.minX - padding),
  formatNumber(-outputBounds.maxY - padding),
  formatNumber(width + padding * 2),
  formatNumber(height + padding * 2),
].join(" ");

const sortedLayerNames = Array.from(pathsByLayer.keys()).sort((a, b) => a.localeCompare(b));
const body = [];

for (const layerName of sortedLayerNames) {
  const className = normalizeLayerName(layerName).includes("sani") || normalizeLayerName(layerName).includes("moeb") ? "cad-detail" : "cad-structure";
  body.push(`<g class="${className}" data-layer="${escapeXml(layerName)}">`);
  for (const path of pathsByLayer.get(layerName) ?? []) {
    body.push(`<path d="${path}" />`);
  }
  for (const circle of circlesByLayer.get(layerName) ?? []) {
    body.push(
      `<circle cx="${formatNumber(circle.center[0])}" cy="${formatNumber(circle.center[1])}" r="${formatNumber(circle.radius)}" />`,
    );
  }
  body.push("</g>");
}

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" role="img" aria-labelledby="title">
  <title id="title">${escapeXml(title)}</title>
  <style>
    svg {
      background: #f8f6ef;
      color: #1d1b18;
    }
    .cad-structure path,
    .cad-structure circle {
      fill: none;
      stroke: currentColor;
      stroke-width: 0.72;
      stroke-linecap: round;
      stroke-linejoin: round;
      vector-effect: non-scaling-stroke;
    }
    .cad-detail path,
    .cad-detail circle {
      fill: none;
      stroke: rgba(29, 27, 24, 0.54);
      stroke-width: 0.5;
      stroke-linecap: round;
      stroke-linejoin: round;
      vector-effect: non-scaling-stroke;
    }
  </style>
  <g transform="scale(1 -1)">
    ${body.join("\n    ")}
  </g>
</svg>
`;

writeFileSync(outputPath, svg);

console.log(`Wrote ${outputPath}`);
console.log(`viewBox ${viewBox}`);
for (const [layerName, stats] of Array.from(layerStats.entries()).sort((a, b) => b[1].entities - a[1].entities)) {
  console.log(`${layerName}: ${stats.entities} entities`);
}
