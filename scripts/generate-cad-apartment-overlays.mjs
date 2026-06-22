import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const [, , inputPath, outputDirArg, manifestPathArg] = process.argv;

if (!inputPath || !outputDirArg || !manifestPathArg) {
  console.error(
    "Usage: node scripts/generate-cad-apartment-overlays.mjs input.min.json output-dir manifest.json",
  );
  process.exit(1);
}

const drawing = JSON.parse(readFileSync(inputPath, "utf8").replace(/\bnan\b/g, "null"));
const outputDir = outputDirArg.endsWith("/") ? outputDirArg : `${outputDirArg}/`;
mkdirSync(outputDir, { recursive: true });

const floors = [
  {
    id: "1og",
    crop: [170, -239, 34, 47],
    apartments: ["WE 03.1", "WE 03.2", "WE 04", "WE 05", "WE 22", "WE 23", "WE 24", "WE 25"],
  },
  {
    id: "2og",
    crop: [232, -239, 34, 47],
    apartments: ["WE 08", "WE 07", "WE 06", "WE 26", "WE 27", "WE 28", "WE 09", "WE 29"],
  },
  {
    id: "3og",
    crop: [170, -303, 35, 47],
    apartments: ["WE 12/13", "WE 10/11", "WE 30", "WE 31/32"],
  },
  {
    id: "4og",
    crop: [232, -303, 35, 47],
    apartments: ["WE 14/15", "WE 16/17", "WE 33/34", "WE 35/36"],
  },
];

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

function formatNumber(value) {
  return Number(value).toFixed(3).replace(/\.?0+$/, "");
}

function slugifyCode(code) {
  return code
    .toLowerCase()
    .replace("we ", "we-")
    .replaceAll("/", "-")
    .replaceAll(".", "-");
}

function apartmentToken(code) {
  return code.replace(/^WE\s+/, "");
}

function textMatchesApartment(text, code) {
  const token = apartmentToken(code).replaceAll("/", "\\/");
  return new RegExp(`(?:WE\\s+${token}\\b|\\b${token}-\\d+)`).test(text);
}

function collectPoint(bounds, x, y) {
  if (!Number.isFinite(x) || !Number.isFinite(y)) return;
  bounds.minX = Math.min(bounds.minX, x);
  bounds.minY = Math.min(bounds.minY, y);
  bounds.maxX = Math.max(bounds.maxX, x);
  bounds.maxY = Math.max(bounds.maxY, y);
}

function boundsForPoints(points) {
  const bounds = {
    minX: Infinity,
    minY: Infinity,
    maxX: -Infinity,
    maxY: -Infinity,
  };
  for (const point of points) {
    if (Array.isArray(point)) collectPoint(bounds, point[0], point[1]);
  }
  return bounds;
}

function intersectsBounds(a, b, margin = 0) {
  return !(
    a.maxX + margin < b.minX ||
    b.maxX + margin < a.minX ||
    a.maxY + margin < b.minY ||
    b.maxY + margin < a.minY
  );
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

function cropBounds([x, y, width, height]) {
  return {
    minX: x,
    minY: y,
    maxX: x + width,
    maxY: y + height,
    width,
    height,
  };
}

function viewBoxForCrop(crop) {
  const [x, y, width, height] = crop;
  const padding = Math.max(width, height) * 0.02;
  return [
    formatNumber(x - padding),
    formatNumber(-(y + height) - padding),
    formatNumber(width + padding * 2),
    formatNumber(height + padding * 2),
  ].join(" ");
}

function svgPathForBounds(bounds) {
  return [
    `M ${formatNumber(bounds.minX)} ${formatNumber(-bounds.minY)}`,
    `L ${formatNumber(bounds.maxX)} ${formatNumber(-bounds.minY)}`,
    `L ${formatNumber(bounds.maxX)} ${formatNumber(-bounds.maxY)}`,
    `L ${formatNumber(bounds.minX)} ${formatNumber(-bounds.maxY)}`,
    "Z",
  ].join(" ");
}

const apartmentSelectionZones = {
  "1og:WE 03.1": [
    { minX: 178.1, minY: -235.4, maxX: 186.9, maxY: -217.7 },
  ],
  "1og:WE 03.2": [
    { minX: 170.6, minY: -231.5, maxX: 179.7, maxY: -221.1 },
    { minX: 170.6, minY: -221.6, maxX: 182.4, maxY: -211.0 },
  ],
  "1og:WE 04": [
    { minX: 186.7, minY: -235.4, maxX: 195.3, maxY: -217.7 },
  ],
  "1og:WE 05": [
    { minX: 195.0, minY: -231.5, maxX: 204.0, maxY: -221.1 },
    { minX: 190.8, minY: -221.6, maxX: 204.0, maxY: -211.0 },
  ],
  "2og:WE 07": [
    { minX: 233.0, minY: -235.4, maxX: 248.2, maxY: -217.4 },
  ],
};

function unionBounds(boundsList) {
  const bounds = {
    minX: Infinity,
    minY: Infinity,
    maxX: -Infinity,
    maxY: -Infinity,
  };

  for (const item of boundsList) {
    collectPoint(bounds, item.minX, item.minY);
    collectPoint(bounds, item.maxX, item.maxY);
  }

  return bounds;
}

function pathForZones(zones) {
  return zones.map((zone) => svgPathForBounds(zone)).join(" ");
}

function boundsCenter(bounds) {
  return {
    x: (bounds.minX + bounds.maxX) / 2,
    y: (bounds.minY + bounds.maxY) / 2,
  };
}

function pointInBounds(point, bounds, margin = 0) {
  return (
    point.x >= bounds.minX - margin &&
    point.x <= bounds.maxX + margin &&
    point.y >= bounds.minY - margin &&
    point.y <= bounds.maxY + margin
  );
}

function pointInAnyBounds(point, boundsList, margin = 0) {
  return boundsList.some((bounds) => pointInBounds(point, bounds, margin));
}

const layers = new Map();
for (const object of drawing.OBJECTS ?? []) {
  if (object.object === "LAYER") layers.set(handleKey(object.handle), object.name ?? "");
}

const vertices = new Map();
for (const object of drawing.OBJECTS ?? []) {
  if (object.entity === "VERTEX_2D" && Array.isArray(object.point)) {
    vertices.set(handleKey(object.handle), object.point);
  }
}

const textEntities = [];
for (const object of drawing.OBJECTS ?? []) {
  if (object.object || object.invisible) continue;
  const text = object.text ?? object.text_value;
  if (!text || !Array.isArray(object.ins_pt)) continue;
  textEntities.push({
    text: String(text).replaceAll("\\P", " "),
    point: object.ins_pt,
    layerName: layers.get(layerHandleKey(object.layer)) ?? "",
  });
}

function shouldUseHighlightLayer(layerName) {
  const layer = normalizeLayerName(layerName);
  if (!layer || layer === "defpoints") return false;
  if (layer.includes("treppen") || layer.includes("beschrift") || layer.includes("text")) return false;
  return [
    "wand",
    "wände",
    "wändebestand",
    "wändeneu",
    "schrwand",
    "schrbestand",
    "aussenhaut",
    "außenhaut",
    "tür",
    "fenster",
    "glas",
  ].some((fragment) => layer.includes(fragment));
}

function objectGeometry(object) {
  if (Array.isArray(object.start) && Array.isArray(object.end)) {
    return { path: pointsToPath([object.start, object.end]), points: [object.start, object.end] };
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
    return { path: pointsToPath(points, isClosed), points };
  }

  if (Array.isArray(object.vertex)) {
    const points = object.vertex
      .map((handle) => vertices.get(handleKey(handle)))
      .filter((point) => Array.isArray(point));
    return { path: pointsToPath(points, Boolean(object.flag && (object.flag & 1))), points };
  }

  if (Array.isArray(object.center) && Number.isFinite(object.radius)) {
    if (Number.isFinite(object.start_angle) && Number.isFinite(object.end_angle)) {
      return {
        path: arcToPath(object.center, object.radius, object.start_angle, object.end_angle),
        points: [
          [object.center[0] - object.radius, object.center[1] - object.radius],
          [object.center[0] + object.radius, object.center[1] + object.radius],
        ],
      };
    }

    return {
      circle: {
        cx: object.center[0],
        cy: object.center[1],
        r: object.radius,
      },
      points: [
        [object.center[0] - object.radius, object.center[1] - object.radius],
        [object.center[0] + object.radius, object.center[1] + object.radius],
      ],
    };
  }

  return null;
}

const drawableObjects = [];
for (const object of drawing.OBJECTS ?? []) {
  if (object.object || object.invisible) continue;
  const layerName = layers.get(layerHandleKey(object.layer)) ?? "";
  if (!shouldUseHighlightLayer(layerName)) continue;

  const geometry = objectGeometry(object);
  if (!geometry) continue;
  const bounds = boundsForPoints(geometry.points);
  if (!Number.isFinite(bounds.minX)) continue;
  const width = bounds.maxX - bounds.minX;
  const height = bounds.maxY - bounds.minY;
  if (width > 22 || height > 22) continue;

  drawableObjects.push({ layerName, bounds, ...geometry });
}

const manifest = {
  floors: {},
  apartments: {},
};

for (const floor of floors) {
  const floorBounds = cropBounds(floor.crop);
  const viewBox = viewBoxForCrop(floor.crop);
  manifest.floors[floor.id] = { viewBox };
  manifest.apartments[floor.id] = {};

  for (const code of floor.apartments) {
    const labelPoints = textEntities
      .filter((entity) => normalizeLayerName(entity.layerName).includes("beschriftung-räume"))
      .filter((entity) => intersectsBounds(boundsForPoints([entity.point]), floorBounds, 0))
      .filter((entity) => textMatchesApartment(entity.text, code))
      .map((entity) => entity.point);

    if (!labelPoints.length) {
      throw new Error(`No CAD room labels found for ${floor.id} ${code}`);
    }

    const labelBounds = boundsForPoints(labelPoints);
    const expand = code.includes("/") ? 2.2 : 1.6;
    const selectionZones = apartmentSelectionZones[`${floor.id}:${code}`];
    const apartmentBounds = selectionZones
      ? unionBounds(selectionZones)
      : {
          minX: Math.max(floorBounds.minX, labelBounds.minX - expand),
          minY: Math.max(floorBounds.minY, labelBounds.minY - expand),
          maxX: Math.min(floorBounds.maxX, labelBounds.maxX + expand),
          maxY: Math.min(floorBounds.maxY, labelBounds.maxY + expand),
        };

    const selected = drawableObjects.filter((item) => {
      if (!intersectsBounds(item.bounds, floorBounds, 0)) return false;

      if (selectionZones) {
        return pointInAnyBounds(boundsCenter(item.bounds), selectionZones, 0.18);
      }

      return intersectsBounds(item.bounds, apartmentBounds, 0.28);
    });

    const body = [];
    for (const item of selected) {
      if (item.path) {
        body.push(`<path d="${item.path}" />`);
      } else if (item.circle) {
        body.push(
          `<circle cx="${formatNumber(item.circle.cx)}" cy="${formatNumber(item.circle.cy)}" r="${formatNumber(item.circle.r)}" />`,
        );
      }
    }

    const fileName = `${floor.id}-${slugifyCode(code)}.svg`;
    const outputPath = `${outputDir}${fileName}`;
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" aria-hidden="true">
  <style>
    path,
    circle {
      fill: none;
      stroke: #007AFF;
      stroke-width: 1.55;
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

    const unitLabel =
      textEntities.find(
        (entity) =>
          normalizeLayerName(entity.layerName).includes("beschriftung-räume") &&
          intersectsBounds(boundsForPoints([entity.point]), floorBounds, 0) &&
          new RegExp(`WE\\s+${apartmentToken(code).replaceAll("/", "\\/")}\\b`).test(entity.text),
      )?.point ?? labelPoints[Math.floor(labelPoints.length / 2)];

    manifest.apartments[floor.id][code] = {
      overlaySrc: `/cad-floorplans/highlights/${fileName}`,
      hitPath: selectionZones ? pathForZones(selectionZones) : svgPathForBounds(apartmentBounds),
      label: {
        x: Number(formatNumber(unitLabel[0])),
        y: Number(formatNumber(-unitLabel[1])),
      },
      labelCount: labelPoints.length,
      entityCount: selected.length,
    };
  }
}

writeFileSync(manifestPathArg, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Generated CAD apartment overlays in ${outputDir}`);
