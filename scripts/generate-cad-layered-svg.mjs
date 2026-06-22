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
  if (!layer) return false;

  const hiddenLayers = ["defpoints", "elektro"];
  return !hiddenLayers.includes(layer);
}

function layerClassName(name) {
  const layer = normalizeLayerName(name);
  if (layer.includes("beschrift") || layer.includes("text")) return "cad-label";
  if (layer.includes("sani") || layer.includes("moeb") || layer.includes("fliesen")) return "cad-detail";
  if (layer.includes("fenster") || layer.includes("tür") || layer.includes("treppen")) return "cad-fixture";
  if (layer.includes("wand") || layer.includes("aussenhaut") || layer.includes("außenhaut")) return "cad-structure";
  return "cad-context";
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

function isLayerZeroDiagonalGuide(layerName, points) {
  if (normalizeLayerName(layerName) !== "0" || points.length !== 2) return false;

  const [start, end] = points;
  if (!Array.isArray(start) || !Array.isArray(end)) return false;

  const width = Math.abs(end[0] - start[0]);
  const height = Math.abs(end[1] - start[1]);
  const length = Math.hypot(width, height);

  return length > 5 && width > 2 && height > 2;
}

function arcToPath(center, radius, startAngle, endAngle) {
  if (!Array.isArray(center) || !Number.isFinite(radius) || radius <= 0) return "";
  if (!Number.isFinite(startAngle) || !Number.isFinite(endAngle)) return "";
  const start = [
    center[0] + Math.cos(startAngle) * radius,
    center[1] + Math.sin(startAngle) * radius,
  ];
  const end = [
    center[0] + Math.cos(endAngle) * radius,
    center[1] + Math.sin(endAngle) * radius,
  ];
  let delta = endAngle - startAngle;
  if (delta < 0) delta += Math.PI * 2;
  const largeArc = delta > Math.PI ? 1 : 0;
  return `M ${formatNumber(start[0])} ${formatNumber(start[1])} A ${formatNumber(radius)} ${formatNumber(radius)} 0 ${largeArc} 1 ${formatNumber(end[0])} ${formatNumber(end[1])}`;
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

function boundsForPathLike(points) {
  return boundsForPoints(points.filter((point) => Array.isArray(point)));
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

const vertices = new Map();
for (const object of drawing.OBJECTS ?? []) {
  if (object.entity === "VERTEX_2D" && Array.isArray(object.point)) {
    vertices.set(handleKey(object.handle), object.point);
  }
}

const pathsByLayer = new Map();
const circlesByLayer = new Map();
const hatchesByLayer = new Map();
const textByLayer = new Map();
const layerStats = new Map();
const bounds = {
  minX: Infinity,
  minY: Infinity,
  maxX: -Infinity,
  maxY: -Infinity,
};

function addPath(layerName, path, points) {
  if (!path) return;
  if (isLayerZeroDiagonalGuide(layerName, points)) return;

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

function addHatch(layerName, path, points) {
  if (!path) return;
  const pointBounds = boundsForPathLike(points);
  if (!Number.isFinite(pointBounds.minX) || !shouldKeepBounds(pointBounds)) return;

  if (!hatchesByLayer.has(layerName)) hatchesByLayer.set(layerName, []);
  hatchesByLayer.get(layerName).push(path);

  const current = layerStats.get(layerName) ?? { entities: 0, segments: 0 };
  current.entities += 1;
  current.segments += Math.max(1, points.length - 1);
  layerStats.set(layerName, current);

  for (const point of points) {
    if (Array.isArray(point)) collectPoint(bounds, point[0], point[1]);
  }
}

function cleanText(value) {
  return String(value ?? "")
    .replaceAll("\\P", " ")
    .replaceAll("\\A1;", "")
    .replaceAll("\\pi5.5511e-017,l0.25,t0.25;", "")
    .replaceAll(/\\H[\d.]+x;\\S2\^;/g, "²")
    .replaceAll(/[{}]/g, "")
    .replaceAll("\\", "")
    .replaceAll(/\s+/g, " ")
    .trim();
}

function textAngle(object) {
  if (Number.isFinite(object.rotation)) return object.rotation;
  if (Array.isArray(object.x_axis_dir)) {
    return Math.atan2(object.x_axis_dir[1] ?? 0, object.x_axis_dir[0] ?? 1);
  }
  return 0;
}

function addText(layerName, object) {
  const value = cleanText(object.text ?? object.text_value);
  const point = object.ins_pt;
  if (!value || !Array.isArray(point)) return;

  const size = Number(object.text_height ?? object.height ?? 0.16);
  const width = Number(object.extents_width ?? object.rect_width ?? value.length * size * 0.55);
  const height = Number(object.extents_height ?? object.rect_height ?? size);
  const pointBounds = {
    minX: point[0] - width * 0.2,
    minY: point[1] - height * 0.6,
    maxX: point[0] + width * 1.2,
    maxY: point[1] + height * 1.2,
  };
  if (!shouldKeepBounds(pointBounds)) return;

  if (!textByLayer.has(layerName)) textByLayer.set(layerName, []);
  textByLayer.get(layerName).push({
    value,
    x: point[0],
    y: point[1],
    angle: textAngle(object),
    size,
  });

  const current = layerStats.get(layerName) ?? { entities: 0, segments: 0 };
  current.entities += 1;
  current.segments += 1;
  layerStats.set(layerName, current);

  collectPoint(bounds, pointBounds.minX, pointBounds.minY);
  collectPoint(bounds, pointBounds.maxX, pointBounds.maxY);
}

function hatchPath(path) {
  const points = [];
  const pathChunks = [];

  if (Array.isArray(path.polyline_paths)) {
    const polyPoints = path.polyline_paths
      .map((entry) => entry?.point)
      .filter((point) => Array.isArray(point));
    points.push(...polyPoints);
    pathChunks.push(pointsToPath(polyPoints, Boolean(path.closed)));
  }

  if (Array.isArray(path.segs)) {
    for (const segment of path.segs) {
      const first = segment.first_endpoint ?? segment.start ?? segment.first;
      const second = segment.second_endpoint ?? segment.end ?? segment.second;
      if (Array.isArray(first) && Array.isArray(second)) {
        points.push(first, second);
        pathChunks.push(pointsToPath([first, second]));
      }
    }
  }

  return { path: pathChunks.filter(Boolean).join(" "), points };
}

for (const object of drawing.OBJECTS ?? []) {
  if (object.object || object.invisible) continue;

  const layerName = layers.get(layerHandleKey(object.layer)) ?? "";
  if (!shouldRenderLayer(layerName)) continue;

  if (object.entity === "MTEXT" || object.entity === "TEXT") {
    addText(layerName, object);
    continue;
  }

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

  if (Array.isArray(object.vertex)) {
    const points = object.vertex
      .map((handle) => vertices.get(handleKey(handle)))
      .filter((point) => Array.isArray(point));
    const isClosed = Boolean(object.flag && (object.flag & 1));
    addPath(layerName, pointsToPath(points, isClosed), points);
    continue;
  }

  if (object.entity === "HATCH" && Array.isArray(object.paths)) {
    for (const path of object.paths) {
      const hatch = hatchPath(path);
      addHatch(layerName, hatch.path, hatch.points);
    }
    continue;
  }

  if (Array.isArray(object.center) && Number.isFinite(object.radius)) {
    if (Number.isFinite(object.start_angle) && Number.isFinite(object.end_angle)) {
      const path = arcToPath(object.center, object.radius, object.start_angle, object.end_angle);
      const points = [
        [object.center[0] - object.radius, object.center[1] - object.radius],
        [object.center[0] + object.radius, object.center[1] + object.radius],
      ];
      addPath(layerName, path, points);
      continue;
    }
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

const sortedLayerNames = Array.from(
  new Set([
    ...pathsByLayer.keys(),
    ...circlesByLayer.keys(),
    ...hatchesByLayer.keys(),
  ]),
).sort((a, b) => a.localeCompare(b));
const body = [];

for (const layerName of sortedLayerNames) {
  const className = layerClassName(layerName);
  body.push(`<g class="${className}" data-layer="${escapeXml(layerName)}">`);
  for (const path of hatchesByLayer.get(layerName) ?? []) {
    body.push(`<path class="cad-hatch" d="${path}" />`);
  }
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

const sortedTextLayerNames = Array.from(textByLayer.keys()).sort((a, b) => a.localeCompare(b));
for (const layerName of sortedTextLayerNames) {
  const className = layerClassName(layerName);
  body.push(`<g class="${className}" data-layer="${escapeXml(layerName)}">`);
  for (const item of textByLayer.get(layerName) ?? []) {
    const rotate = formatNumber((-item.angle * 180) / Math.PI);
    body.push(
      `<text x="${formatNumber(item.x)}" y="${formatNumber(-item.y)}" transform="rotate(${rotate} ${formatNumber(item.x)} ${formatNumber(-item.y)})" font-size="${formatNumber(Math.max(item.size * 1.7, 0.18))}">${escapeXml(item.value)}</text>`,
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
    .cad-fixture path,
    .cad-fixture circle {
      fill: none;
      stroke: rgba(29, 27, 24, 0.76);
      stroke-width: 0.52;
      stroke-linecap: round;
      stroke-linejoin: round;
      vector-effect: non-scaling-stroke;
    }
    .cad-context path,
    .cad-context circle {
      fill: none;
      stroke: rgba(29, 27, 24, 0.34);
      stroke-width: 0.38;
      stroke-linecap: round;
      stroke-linejoin: round;
      vector-effect: non-scaling-stroke;
    }
    .cad-hatch {
      fill: rgba(29, 27, 24, 0.045);
      stroke: rgba(29, 27, 24, 0.16);
      stroke-width: 0.22;
    }
    .cad-label text {
      fill: rgba(29, 27, 24, 0.58);
      font-family: Arial, Helvetica, sans-serif;
      letter-spacing: 0;
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
