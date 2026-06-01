import { readFileSync, writeFileSync } from "node:fs";

const [, , inputPath, outputPath, title = "CAD floor plan"] = process.argv;

if (!inputPath || !outputPath) {
  console.error("Usage: node scripts/generate-cad-svgs.mjs input.geojson output.svg [title]");
  process.exit(1);
}

const geojson = JSON.parse(readFileSync(inputPath, "utf8"));
const segments = [];
const polygons = [];
const points = [];

function visitCoordinates(coordinates, visitor) {
  if (!Array.isArray(coordinates)) return;
  if (typeof coordinates[0] === "number" && typeof coordinates[1] === "number") {
    visitor(coordinates[0], coordinates[1]);
    return;
  }
  for (const child of coordinates) visitCoordinates(child, visitor);
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

function pointsToPath(ring, close = false) {
  if (!ring.length) return "";
  const [first, ...rest] = ring;
  const commands = [`M ${formatNumber(first[0])} ${formatNumber(first[1])}`];
  for (const point of rest) {
    commands.push(`L ${formatNumber(point[0])} ${formatNumber(point[1])}`);
  }
  if (close) commands.push("Z");
  return commands.join(" ");
}

for (const feature of geojson.features ?? []) {
  const geometry = feature.geometry;
  if (!geometry) continue;

  if (geometry.type === "LineString") {
    segments.push(geometry.coordinates);
    continue;
  }

  if (geometry.type === "MultiLineString") {
    segments.push(...geometry.coordinates);
    continue;
  }

  if (geometry.type === "Polygon") {
    polygons.push(geometry.coordinates);
    continue;
  }

  if (geometry.type === "MultiPolygon") {
    for (const polygon of geometry.coordinates) polygons.push(polygon);
    continue;
  }

  if (geometry.type === "Point") {
    points.push(geometry.coordinates);
  }
}

let minX = Infinity;
let minY = Infinity;
let maxX = -Infinity;
let maxY = -Infinity;

for (const feature of geojson.features ?? []) {
  visitCoordinates(feature.geometry?.coordinates, (x, y) => {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  });
}

if (!Number.isFinite(minX) || !Number.isFinite(minY) || !Number.isFinite(maxX) || !Number.isFinite(maxY)) {
  console.error("No drawable CAD geometry found.");
  process.exit(1);
}

const width = maxX - minX;
const height = maxY - minY;
const padding = Math.max(width, height) * 0.012;
const viewBox = [
  formatNumber(minX - padding),
  formatNumber(minY - padding),
  formatNumber(width + padding * 2),
  formatNumber(height + padding * 2),
].join(" ");

const pathChunks = [];

if (polygons.length) {
  pathChunks.push('<g class="cad-fills">');
  for (const polygon of polygons) {
    const path = polygon.map((ring) => pointsToPath(ring, true)).join(" ");
    if (path) pathChunks.push(`<path d="${path}" />`);
  }
  pathChunks.push("</g>");
}

pathChunks.push('<g class="cad-lines">');
for (const line of segments) {
  const path = pointsToPath(line);
  if (path) pathChunks.push(`<path d="${path}" />`);
}
pathChunks.push("</g>");

if (points.length) {
  pathChunks.push('<g class="cad-points">');
  for (const [x, y] of points) {
    pathChunks.push(`<circle cx="${formatNumber(x)}" cy="${formatNumber(y)}" r="0.08" />`);
  }
  pathChunks.push("</g>");
}

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" role="img" aria-labelledby="title">
  <title id="title">${escapeXml(title)}</title>
  <style>
    svg {
      background: #f8f6ef;
      color: #1d1b18;
    }
    .cad-fills path {
      fill: rgba(201, 177, 133, 0.13);
      stroke: rgba(29, 27, 24, 0.34);
      stroke-width: 0.045;
      vector-effect: non-scaling-stroke;
    }
    .cad-lines path {
      fill: none;
      stroke: currentColor;
      stroke-width: 0.06;
      stroke-linecap: round;
      stroke-linejoin: round;
      vector-effect: non-scaling-stroke;
    }
    .cad-points circle {
      fill: currentColor;
      opacity: 0.35;
      vector-effect: non-scaling-stroke;
    }
  </style>
  <g transform="scale(1 -1)">
    ${pathChunks.join("\n    ")}
  </g>
</svg>
`;

writeFileSync(outputPath, svg);
console.log(`Wrote ${outputPath}`);
