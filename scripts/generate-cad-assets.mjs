import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

const rentalDwg =
  process.env.LOLA_RENTAL_DWG ??
  fileURLToPath(
    new URL("../data/cad files/Hol18 - Vermietungsgrundrisse.dwg", import.meta.url),
  );
const floorsDwg =
  process.env.LOLA_FLOORS_DWG ??
  fileURLToPath(
    new URL("../data/cad files/Hol18 - Grundrisse EG - DG.dwg", import.meta.url),
  );
const dwgread = process.env.DWGREAD_BIN ?? "/opt/homebrew/bin/dwgread";

const generator = fileURLToPath(
  new URL("./generate-cad-layered-svg.mjs", import.meta.url),
);
const overlayGenerator = fileURLToPath(
  new URL("./generate-cad-apartment-overlays.mjs", import.meta.url),
);
const outputDir = fileURLToPath(
  new URL("../public/cad-floorplans/", import.meta.url),
);
const highlightOutputDir = fileURLToPath(
  new URL("../public/cad-floorplans/highlights/", import.meta.url),
);
const highlightManifest = fileURLToPath(
  new URL("../data/generated-cad-apartment-highlights.json", import.meta.url),
);
const tempDir = "/private/tmp/lola-cad";
const rentalJson = `${tempDir}/vermietungsgrundrisse.min.json`;
const floorsJson = `${tempDir}/grundrisse-eg-dg.min.json`;

const assets = [
  ["floors", "floor-1og.svg", "Holsteinische 18 1. Obergeschoss", "170,-239,34,47"],
  ["floors", "floor-2og.svg", "Holsteinische 18 2. Obergeschoss", "232,-239,34,47"],
  ["floors", "floor-3og.svg", "Holsteinische 18 3. Obergeschoss", "170,-303,35,47"],
  ["floors", "floor-4og.svg", "Holsteinische 18 4. Obergeschoss", "232,-303,35,47"],
];

mkdirSync(tempDir, { recursive: true });
mkdirSync(outputDir, { recursive: true });
mkdirSync(highlightOutputDir, { recursive: true });

execFileSync(dwgread, ["-O", "minJSON", "-o", rentalJson, rentalDwg], {
  stdio: "ignore",
});
execFileSync(dwgread, ["-O", "minJSON", "-o", floorsJson, floorsDwg], {
  stdio: "ignore",
});

for (const [source, fileName, title, crop] of assets) {
  const input = source === "rental" ? rentalJson : floorsJson;
  const output = `${outputDir}${fileName}`;
  const args = [generator, input, output, title];
  if (crop) args.push(crop);
  execFileSync(process.execPath, args, { stdio: "ignore" });
}

execFileSync(process.execPath, [overlayGenerator, floorsJson, highlightOutputDir, highlightManifest], {
  stdio: "ignore",
});

console.log(`Generated ${assets.length} CAD SVG assets in ${outputDir}`);
console.log(`Generated CAD apartment overlays in ${highlightOutputDir}`);
