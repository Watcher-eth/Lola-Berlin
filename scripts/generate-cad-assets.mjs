import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

const rentalDwg =
  process.env.LOLA_RENTAL_DWG ??
  "/Users/watcher/Desktop/grundrisse h18/Hol18 - Vermietungsgrundrisse.dwg";
const floorsDwg =
  process.env.LOLA_FLOORS_DWG ??
  "/Users/watcher/Desktop/grundrisse h18/Hol18 - Grundrisse EG - DG.dwg";

const generator = fileURLToPath(
  new URL("./generate-cad-layered-svg.mjs", import.meta.url),
);
const outputDir = fileURLToPath(
  new URL("../public/cad-floorplans/", import.meta.url),
);
const tempDir = "/private/tmp/lola-cad";
const rentalJson = `${tempDir}/vermietungsgrundrisse.min.json`;
const floorsJson = `${tempDir}/grundrisse-eg-dg.min.json`;

const assets = [
  ["rental", "vermietungsgrundrisse.svg", "Holsteinische 18 Vermietungsgrundrisse"],
  ["floors", "grundrisse-eg-dg.svg", "Holsteinische 18 Grundrisse EG bis DG"],
  ["floors", "floor-1og.svg", "Holsteinische 18 1. Obergeschoss", "109,-237,33,45"],
  ["floors", "floor-2og.svg", "Holsteinische 18 2. Obergeschoss", "170,-239,34,47"],
  ["floors", "floor-3og.svg", "Holsteinische 18 3. Obergeschoss", "232,-239,34,47"],
  ["floors", "floor-4og.svg", "Holsteinische 18 4. Obergeschoss", "170,-303,35,47"],
  ["rental", "apartment-1og-vh-left.svg", "WE 04 Vorderhaus links", "16,-546,22,29"],
  ["rental", "apartment-1og-vh-right.svg", "WE 03 Vorderhaus rechts", "42,-546,20,29"],
  ["rental", "apartment-1og-gh-left.svg", "WE 23 Hinterhaus links", "104,-546,24,30"],
  ["rental", "apartment-1og-gh-right.svg", "WE 25 Hinterhaus rechts", "127,-546,21,30"],
  ["rental", "apartment-2og-vh-left.svg", "WE 08 Vorderhaus links", "170,-557,16,16"],
  ["rental", "apartment-2og-vh-right.svg", "WE 07 Vorderhaus rechts", "188,-557,12,16"],
  ["rental", "apartment-2og-sfl-left.svg", "WE 06 Seitenflügel links", "201,-557,20,16"],
  ["rental", "apartment-2og-sfl-right.svg", "WE 09 Seitenflügel rechts", "219,-563,13,24"],
  ["rental", "apartment-3og-left.svg", "WE 30 3. Obergeschoss links", "170,-623,18,23"],
  ["rental", "apartment-3og-center.svg", "3. Obergeschoss Mitte", "187,-623,12,22"],
  ["rental", "apartment-3og-right.svg", "WE 31 32 3. Obergeschoss rechts", "197,-623,22,22"],
  ["rental", "apartment-3og-edge.svg", "3. Obergeschoss Rand", "218,-624,14,25"],
  ["rental", "apartment-4og-left.svg", "WE 14 15 4. Obergeschoss links", "171,-655,20,30"],
  ["rental", "apartment-4og-right.svg", "WE 35 36 4. Obergeschoss rechts", "194,-655,21,30"],
  ["rental", "apartment-combined-long.svg", "Kombinierter Vorderhaus Seitenflügel Plan", "171,-586,39,24"],
];

mkdirSync(tempDir, { recursive: true });
mkdirSync(outputDir, { recursive: true });

execFileSync("dwgread", ["-O", "minJSON", "-o", rentalJson, rentalDwg], {
  stdio: "ignore",
});
execFileSync("dwgread", ["-O", "minJSON", "-o", floorsJson, floorsDwg], {
  stdio: "ignore",
});

for (const [source, fileName, title, crop] of assets) {
  const input = source === "rental" ? rentalJson : floorsJson;
  const output = `${outputDir}${fileName}`;
  const args = [generator, input, output, title];
  if (crop) args.push(crop);
  execFileSync(process.execPath, args, { stdio: "ignore" });
}

console.log(`Generated ${assets.length} CAD SVG assets in ${outputDir}`);
