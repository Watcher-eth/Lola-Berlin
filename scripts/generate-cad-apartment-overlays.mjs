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

function contentHash(value) {
  let hash = 5381;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 33) ^ value.charCodeAt(index);
  }
  return (hash >>> 0).toString(36);
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

function lineIntersectsBounds(start, end, bounds) {
  const lineBounds = boundsForPoints([start, end]);
  return intersectsBounds(lineBounds, bounds, 0);
}

function clipLineToBounds(start, end, bounds) {
  let t0 = 0;
  let t1 = 1;
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const checks = [
    [-dx, start[0] - bounds.minX],
    [dx, bounds.maxX - start[0]],
    [-dy, start[1] - bounds.minY],
    [dy, bounds.maxY - start[1]],
  ];

  for (const [p, q] of checks) {
    if (p === 0) {
      if (q < 0) return null;
      continue;
    }

    const r = q / p;
    if (p < 0) {
      if (r > t1) return null;
      if (r > t0) t0 = r;
    } else {
      if (r < t0) return null;
      if (r < t1) t1 = r;
    }
  }

  const clippedStart = [start[0] + t0 * dx, start[1] + t0 * dy];
  const clippedEnd = [start[0] + t1 * dx, start[1] + t1 * dy];
  if (Math.hypot(clippedEnd[0] - clippedStart[0], clippedEnd[1] - clippedStart[1]) < 0.001) {
    return null;
  }

  return [clippedStart, clippedEnd];
}

function clipSegmentToZones(start, end, zones) {
  const clipped = [];
  for (const zone of zones) {
    if (!lineIntersectsBounds(start, end, zone)) continue;
    const segment = clipLineToBounds(start, end, zone);
    if (segment) clipped.push(segment);
  }
  return clipped;
}

function segmentParameterForPoint(start, end, point) {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  if (Math.abs(dx) >= Math.abs(dy)) return dx === 0 ? 0 : (point[0] - start[0]) / dx;
  return dy === 0 ? 0 : (point[1] - start[1]) / dy;
}

function subtractExclusionZones(start, end, zones) {
  let ranges = [[0, 1]];

  for (const zone of zones) {
    if (!lineIntersectsBounds(start, end, zone)) continue;
    const clipped = clipLineToBounds(start, end, zone);
    if (!clipped) continue;

    const tA = segmentParameterForPoint(start, end, clipped[0]);
    const tB = segmentParameterForPoint(start, end, clipped[1]);
    const removeStart = Math.max(0, Math.min(tA, tB));
    const removeEnd = Math.min(1, Math.max(tA, tB));
    if (removeEnd <= removeStart) continue;

    const nextRanges = [];
    for (const [rangeStart, rangeEnd] of ranges) {
      if (removeEnd <= rangeStart || removeStart >= rangeEnd) {
        nextRanges.push([rangeStart, rangeEnd]);
        continue;
      }
      if (removeStart > rangeStart) nextRanges.push([rangeStart, removeStart]);
      if (removeEnd < rangeEnd) nextRanges.push([removeEnd, rangeEnd]);
    }
    ranges = nextRanges;
  }

  return ranges
    .map(([rangeStart, rangeEnd]) => {
      const dx = end[0] - start[0];
      const dy = end[1] - start[1];
      const clippedStart = [start[0] + dx * rangeStart, start[1] + dy * rangeStart];
      const clippedEnd = [start[0] + dx * rangeEnd, start[1] + dy * rangeEnd];
      if (Math.hypot(clippedEnd[0] - clippedStart[0], clippedEnd[1] - clippedStart[1]) < 0.001) {
        return null;
      }
      return [clippedStart, clippedEnd];
    })
    .filter(Boolean);
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

function segmentsForPoints(points, close = false) {
  const segments = [];
  for (let index = 0; index < points.length - 1; index += 1) {
    if (Array.isArray(points[index]) && Array.isArray(points[index + 1])) {
      segments.push([points[index], points[index + 1]]);
    }
  }

  const first = points[0];
  const last = points.at(-1);
  if (close && Array.isArray(first) && Array.isArray(last)) {
    segments.push([last, first]);
  }

  return segments;
}

function clippedPathsForItem(item, zones, exclusionZones, boundaryZones, boundaryMargin = 1000) {
  if (!item.segments?.length) return [];
  const paths = [];

  for (const [start, end] of item.segments) {
    for (const clipped of clipSegmentToZones(start, end, zones)) {
      const remainingSegments = subtractExclusionZones(clipped[0], clipped[1], exclusionZones);
      for (const segment of remainingSegments) {
        const midpoint = {
          x: (segment[0][0] + segment[1][0]) / 2,
          y: (segment[0][1] + segment[1][1]) / 2,
        };
        if (!pointNearExternalBoundary(midpoint, boundaryZones, boundaryMargin)) continue;
        paths.push(pointsToPath(segment));
      }
    }
  }

  return paths;
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

function expandBounds(bounds, amount) {
  return {
    minX: bounds.minX - amount,
    minY: bounds.minY - amount,
    maxX: bounds.maxX + amount,
    maxY: bounds.maxY + amount,
  };
}

const apartmentSelectionZones = {
  "1og:WE 22": [
    { minX: 170.6, minY: -211.0, maxX: 179.0, maxY: -196.0 },
    { minX: 179.0, minY: -211.0, maxX: 181.0, maxY: -203.8 },
  ],
  "1og:WE 23": [
    { minX: 178.75, minY: -203.8, maxX: 186.9, maxY: -194.2 },
    { minX: 180.75, minY: -210.8, maxX: 186.9, maxY: -203.8 },
  ],
  "1og:WE 24": [
    { minX: 192.7, minY: -211.0, maxX: 199.65, maxY: -203.8 },
    { minX: 193.2, minY: -203.8, maxX: 199.65, maxY: -196.0 },
  ],
  "1og:WE 25": [
    { minX: 186.45, minY: -203.8, maxX: 192.1, maxY: -194.2 },
    { minX: 186.45, minY: -210.8, maxX: 191.7, maxY: -203.8 },
  ],
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
    { minX: 194.55, minY: -231.5, maxX: 199.65, maxY: -221.1 },
    { minX: 190.45, minY: -221.6, maxX: 199.65, maxY: -213.25 },
  ],
  "2og:WE 07": [
    { minX: 233.0, minY: -235.4, maxX: 241.0, maxY: -225.8 },
    { minX: 240.6, minY: -235.4, maxX: 247.65, maxY: -227.0 },
    { minX: 241.0, minY: -227.2, maxX: 247.65, maxY: -221.5 },
  ],
  "2og:WE 08": [
    { minX: 247.65, minY: -235.4, maxX: 257.1, maxY: -217.7 },
  ],
  "2og:WE 06": [
    { minX: 233.9, minY: -221.4, maxX: 242.85, maxY: -216.8 },
    { minX: 233.9, minY: -216.8, maxX: 244.45, maxY: -212.8 },
  ],
  "2og:WE 09": [
    { minX: 257.1, minY: -223.2, maxX: 265.4, maxY: -217.7 },
    { minX: 255.85, minY: -217.7, maxX: 263.25, maxY: -213.2 },
  ],
  "2og:WE 26": [
    { minX: 234.0, minY: -212.7, maxX: 243.25, maxY: -207.6 },
    { minX: 235.0, minY: -207.6, maxX: 243.25, maxY: -203.65 },
  ],
  "2og:WE 27": [
    { minX: 235.4, minY: -203.55, maxX: 248.25, maxY: -193.55 },
    { minX: 243.65, minY: -208.65, maxX: 248.25, maxY: -203.55 },
  ],
  "2og:WE 28": [
    { minX: 249.0, minY: -209.0, maxX: 253.7, maxY: -203.65 },
    { minX: 249.05, minY: -203.65, maxX: 256.8, maxY: -196.2 },
  ],
  "2og:WE 29": [
    { minX: 253.7, minY: -211.0, maxX: 265.3, maxY: -203.65 },
    { minX: 256.8, minY: -203.65, maxX: 265.3, maxY: -194.8 },
  ],
  "3og:WE 10/11": [
    { minX: 170.6, minY: -300.0, maxX: 186.35, maxY: -276.0 },
  ],
  "3og:WE 12/13": [
    { minX: 186.35, minY: -300.0, maxX: 204.4, maxY: -276.0 },
  ],
  "3og:WE 30": [
    { minX: 170.6, minY: -275.1, maxX: 186.35, maxY: -258.2 },
  ],
  "3og:WE 31/32": [
    { minX: 186.35, minY: -275.1, maxX: 204.4, maxY: -258.2 },
  ],
  "4og:WE 14/15": [
    { minX: 232.6, minY: -300.0, maxX: 248.45, maxY: -276.0 },
  ],
  "4og:WE 16/17": [
    { minX: 248.45, minY: -300.0, maxX: 266.4, maxY: -276.0 },
  ],
  "4og:WE 33/34": [
    { minX: 232.6, minY: -275.1, maxX: 248.45, maxY: -258.2 },
  ],
  "4og:WE 35/36": [
    { minX: 248.45, minY: -275.1, maxX: 266.4, maxY: -258.2 },
  ],
};

const apartmentHitZones = {
  "1og:WE 03.1": [
    { minX: 178.9, minY: -235.4, maxX: 186.7, maxY: -217.7 },
  ],
  "1og:WE 03.2": [
    { minX: 170.6, minY: -231.5, maxX: 178.9, maxY: -221.1 },
    { minX: 170.6, minY: -221.1, maxX: 178.9, maxY: -217.7 },
    { minX: 170.6, minY: -217.7, maxX: 182.4, maxY: -211.0 },
  ],
  "1og:WE 04": [
    { minX: 186.7, minY: -235.4, maxX: 195.0, maxY: -217.7 },
  ],
  "1og:WE 05": [
    { minX: 195.0, minY: -231.5, maxX: 204.0, maxY: -221.1 },
    { minX: 195.0, minY: -221.1, maxX: 204.0, maxY: -217.7 },
    { minX: 190.8, minY: -217.7, maxX: 204.0, maxY: -211.0 },
  ],
};

const apartmentExclusionZones = {
  "1og:WE 03.2": [
    { minX: 178.9, minY: -221.6, maxX: 186.9, maxY: -217.2 },
  ],
  "1og:WE 05": [
    { minX: 199.7, minY: -239.0, maxX: 204.5, maxY: -210.5 },
    { minX: 190.2, minY: -213.15, maxX: 200.0, maxY: -210.5 },
  ],
  "1og:WE 24": [
    { minX: 199.7, minY: -211.3, maxX: 204.5, maxY: -195.7 },
  ],
  "1og:WE 25": [
    { minX: 192.1, minY: -204.2, maxX: 194.3, maxY: -193.9 },
  ],
  "2og:WE 07": [
    { minX: 232.0, minY: -220.2, maxX: 245.0, maxY: -211.8 },
    { minX: 247.6, minY: -229.2, maxX: 249.1, maxY: -220.9 },
  ],
  "2og:WE 06": [
    { minX: 232.0, minY: -222.0, maxX: 233.85, maxY: -212.4 },
    { minX: 236.2, minY: -222.0, maxX: 236.9, maxY: -212.4 },
    { minX: 244.45, minY: -212.4, maxX: 246.0, maxY: -209.8 },
  ],
  "2og:WE 26": [
    { minX: 232.0, minY: -213.1, maxX: 233.85, maxY: -203.3 },
    { minX: 244.0, minY: -213.1, maxX: 246.3, maxY: -203.3 },
  ],
  "2og:WE 27": [
    { minX: 232.0, minY: -212.8, maxX: 243.45, maxY: -203.75 },
  ],
  "2og:WE 28": [
    { minX: 247.8, minY: -205.6, maxX: 249.15, maxY: -198.9 },
  ],
  "2og:WE 09": [
    { minX: 253.5, minY: -218.0, maxX: 257.0, maxY: -211.0 },
    { minX: 253.5, minY: -213.1, maxX: 265.6, maxY: -210.5 },
    { minX: 259.45, minY: -216.5, maxX: 260.35, maxY: -213.2 },
    { minX: 261.0, minY: -223.8, maxX: 262.0, maxY: -213.0 },
    { minX: 263.25, minY: -223.6, maxX: 266.0, maxY: -213.0 },
  ],
};

const apartmentHighlightColors = {
  "2og:WE 27": "#FF3B30",
};

const apartmentLayerExclusionFragments = {
  "2og:WE 06": ["wändegk"],
  "2og:WE 09": ["wändegk"],
};

const apartmentBalconyZones = {
  "1og:WE 03.1": [
    { minX: 180.2, minY: -236.2, maxX: 186.9, maxY: -232.8 },
  ],
  "1og:WE 03.2": [
    { minX: 170.4, minY: -236.2, maxX: 178.9, maxY: -232.8 },
  ],
  "1og:WE 04": [
    { minX: 186.9, minY: -236.2, maxX: 195.2, maxY: -232.8 },
  ],
  "1og:WE 23": [
    { minX: 178.9, minY: -197.4, maxX: 186.9, maxY: -193.4 },
  ],
  "1og:WE 24": [
    { minX: 193.2, minY: -197.4, maxX: 199.65, maxY: -193.4 },
  ],
  "1og:WE 25": [
    { minX: 186.45, minY: -197.4, maxX: 192.1, maxY: -193.4 },
  ],
  "2og:WE 07": [
    { minX: 233.0, minY: -236.2, maxX: 241.0, maxY: -232.8 },
  ],
  "2og:WE 08": [
    { minX: 247.65, minY: -236.2, maxX: 257.1, maxY: -232.8 },
  ],
  "2og:WE 27": [
    { minX: 235.4, minY: -197.4, maxX: 248.6, maxY: -193.4 },
  ],
  "2og:WE 28": [
    { minX: 248.6, minY: -197.4, maxX: 256.4, maxY: -193.4 },
  ],
  "2og:WE 29": [
    { minX: 256.4, minY: -197.4, maxX: 265.3, maxY: -193.4 },
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

function pointNearRange(value, min, max, margin) {
  return value >= min - margin && value <= max + margin;
}

function pointNearExternalBoundary(point, zones, margin = 1000) {
  const epsilon = 0.02;

  for (const zone of zones) {
    const nearLeft =
      Math.abs(point.x - zone.minX) <= margin &&
      pointNearRange(point.y, zone.minY, zone.maxY, margin) &&
      !pointInAnyBounds({ x: zone.minX - epsilon, y: point.y }, zones, 0);
    const nearRight =
      Math.abs(point.x - zone.maxX) <= margin &&
      pointNearRange(point.y, zone.minY, zone.maxY, margin) &&
      !pointInAnyBounds({ x: zone.maxX + epsilon, y: point.y }, zones, 0);
    const nearBottom =
      Math.abs(point.y - zone.minY) <= margin &&
      pointNearRange(point.x, zone.minX, zone.maxX, margin) &&
      !pointInAnyBounds({ x: point.x, y: zone.minY - epsilon }, zones, 0);
    const nearTop =
      Math.abs(point.y - zone.maxY) <= margin &&
      pointNearRange(point.x, zone.minX, zone.maxX, margin) &&
      !pointInAnyBounds({ x: point.x, y: zone.maxY + epsilon }, zones, 0);

    if (nearLeft || nearRight || nearBottom || nearTop) return true;
  }

  return false;
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
  if (layer.includes("masse") || layer.includes("elektro") || layer.includes("befestigung")) {
    return false;
  }
  if (layer.includes("sani") || layer.includes("moeb") || layer.includes("fliesen")) return false;
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
    "geländer",
    "glas",
  ].some((fragment) => layer.includes(fragment));
}

function isBalconyLayer(layerName) {
  const layer = normalizeLayerName(layerName);
  return layer.includes("geländer") || layer.includes("glas");
}

function objectGeometry(object) {
  if (Array.isArray(object.start) && Array.isArray(object.end)) {
    const points = [object.start, object.end];
    return {
      path: pointsToPath(points),
      points,
      segments: segmentsForPoints(points),
    };
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
    return {
      path: pointsToPath(points, isClosed),
      points,
      segments: segmentsForPoints(points, isClosed),
    };
  }

  if (Array.isArray(object.vertex)) {
    const points = object.vertex
      .map((handle) => vertices.get(handleKey(handle)))
      .filter((point) => Array.isArray(point));
    const isClosed = Boolean(object.flag && (object.flag & 1));
    return {
      path: pointsToPath(points, isClosed),
      points,
      segments: segmentsForPoints(points, isClosed),
    };
  }

  if (Array.isArray(object.center) && Number.isFinite(object.radius)) {
    if (Number.isFinite(object.start_angle) && Number.isFinite(object.end_angle)) {
      return {
        path: arcToPath(object.center, object.radius, object.start_angle, object.end_angle),
        pathCenter: {
          x: object.center[0],
          y: object.center[1],
        },
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
  const floorRoomLabels = textEntities
    .filter((entity) => normalizeLayerName(entity.layerName).includes("beschriftung-räume"))
    .filter((entity) => intersectsBounds(boundsForPoints([entity.point]), floorBounds, 0));

  manifest.floors[floor.id] = { viewBox };
  manifest.apartments[floor.id] = {};

  for (const code of floor.apartments) {
    const apartmentKey = `${floor.id}:${code}`;
    const labelPoints = floorRoomLabels
      .filter((entity) => textMatchesApartment(entity.text, code))
      .map((entity) => entity.point);

    if (!labelPoints.length) {
      throw new Error(`No CAD room labels found for ${floor.id} ${code}`);
    }

    const labelBounds = boundsForPoints(labelPoints);
    const expand = code.includes("/") ? 2.2 : 1.6;
    const selectionZones = apartmentSelectionZones[apartmentKey];
    const hitZones = apartmentHitZones[apartmentKey] ?? selectionZones;
    const exclusionZones = apartmentExclusionZones[apartmentKey] ?? [];
    const balconyZones = apartmentBalconyZones[apartmentKey] ?? [];
    const excludedLayerFragments = apartmentLayerExclusionFragments[apartmentKey] ?? [];
    const apartmentBounds = selectionZones
      ? unionBounds(selectionZones)
      : {
          minX: Math.max(floorBounds.minX, labelBounds.minX - expand),
          minY: Math.max(floorBounds.minY, labelBounds.minY - expand),
          maxX: Math.min(floorBounds.maxX, labelBounds.maxX + expand),
          maxY: Math.min(floorBounds.maxY, labelBounds.maxY + expand),
        };
    const boundaryZones = selectionZones ?? [apartmentBounds];
    const clippingZones = boundaryZones.map((zone) => expandBounds(zone, 0.22));

    const selected = drawableObjects.filter((item) => {
      if (!intersectsBounds(item.bounds, floorBounds, 0)) return false;

      if (selectionZones) {
        return clippingZones.some((zone) => intersectsBounds(item.bounds, zone, 0));
      }

      return intersectsBounds(item.bounds, apartmentBounds, 0.28);
    });

    const body = [];
    for (const item of selected) {
      const normalizedLayer = normalizeLayerName(item.layerName);
      if (excludedLayerFragments.some((fragment) => normalizedLayer.includes(fragment))) {
        continue;
      }

      const balconyItem = isBalconyLayer(item.layerName);
      if (balconyItem && !balconyZones.length) continue;

      const itemZones = (balconyItem ? balconyZones : clippingZones).map((zone) =>
        expandBounds(zone, 0.08),
      );
      const itemExclusionZones = balconyItem ? [] : exclusionZones;

      if (item.segments?.length) {
        for (const path of clippedPathsForItem(item, itemZones, itemExclusionZones, itemZones)) {
          body.push(`<path d="${path}" />`);
        }
      } else if (item.circle) {
        const center = { x: item.circle.cx, y: item.circle.cy };
        if (
          pointInAnyBounds(center, itemZones, 0) &&
          !pointInAnyBounds(center, itemExclusionZones, 0) &&
          pointNearExternalBoundary(center, itemZones)
        ) {
          body.push(
            `<circle cx="${formatNumber(item.circle.cx)}" cy="${formatNumber(item.circle.cy)}" r="${formatNumber(item.circle.r)}" />`,
          );
        }
      } else if (item.path) {
        const center = item.pathCenter ?? boundsCenter(item.bounds);
        if (
          pointInAnyBounds(center, itemZones, 0) &&
          !pointInAnyBounds(center, itemExclusionZones, 0) &&
          pointNearExternalBoundary(center, itemZones)
        ) {
          body.push(`<path d="${item.path}" />`);
        }
      }
    }

    const fileName = `${floor.id}-${slugifyCode(code)}.svg`;
    const outputPath = `${outputDir}${fileName}`;
    const highlightColor = apartmentHighlightColors[apartmentKey] ?? "#007AFF";
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" aria-hidden="true">
  <style>
    path,
    circle {
      fill: none;
      stroke: ${highlightColor};
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
      overlaySrc: `/cad-floorplans/highlights/${fileName}?v=${contentHash(svg)}`,
      hitPath: hitZones ? pathForZones(hitZones) : svgPathForBounds(apartmentBounds),
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
