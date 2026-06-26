import generatedCadApartmentHighlights from "@/data/generated-cad-apartment-highlights.json";

export type ApartmentStatus = "Auf Anfrage" | "Vermietet";
export type HouseSection = "Vorderhaus" | "Seitenflügel" | "Hinterhaus";
export type PlanQuality = "exact" | "typology";

export type ApartmentHighlight = {
  overlaySrc: string;
  hitPath: string;
  label: {
    x: number;
    y: number;
  };
  labelCount: number;
  entityCount: number;
};

export type ApartmentUnit = {
  id: string;
  code: string;
  title: string;
  floorId: string;
  floorLabel: string;
  section: HouseSection;
  position: string;
  sqm: number;
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  availability: ApartmentStatus;
  coldRent?: number;
  balcony: boolean;
  gardenAccess: boolean;
  note: string;
  cadPlanSrc: string;
  outlineMaskSrc?: string;
  planQuality: PlanQuality;
  modelLabel: string;
  highlight: ApartmentHighlight;
};

export type FloorPlanData = {
  id: string;
  label: string;
  floorLabel: string;
  note: string;
  modelNote: string;
  cadFloorSrc: string;
  highlightViewBox: string;
  apartments: ApartmentUnit[];
};

type ApartmentSeed = Omit<
  ApartmentUnit,
  "id" | "floorId" | "floorLabel" | "availability" | "highlight"
> & {
  availability?: ApartmentStatus;
  highlightCode?: string;
};

const cadRoot = "/cad-floorplans";

const cadPlans = {
  floor1: `${cadRoot}/floor-1og.svg`,
  floor2: `${cadRoot}/floor-2og.svg`,
  floor3: `${cadRoot}/floor-3og.svg`,
  floor4: `${cadRoot}/floor-4og.svg`,
  apt1VhLeft: `${cadRoot}/apartment-1og-vh-left.svg`,
  apt1VhRight: `${cadRoot}/apartment-1og-vh-right.svg`,
  apt1GhLeft: `${cadRoot}/apartment-1og-gh-left.svg`,
  apt1GhRight: `${cadRoot}/apartment-1og-gh-right.svg`,
  apt2VhLeft: `${cadRoot}/apartment-2og-vh-left.svg`,
  apt2VhRight: `${cadRoot}/apartment-2og-vh-right.svg`,
  apt2SflLeft: `${cadRoot}/apartment-2og-sfl-left.svg`,
  apt2SflRight: `${cadRoot}/apartment-2og-sfl-right.svg`,
  apt2SflInnerLeft: `${cadRoot}/apartment-2og-sfl-inner-left.png`,
  apt3Left: `${cadRoot}/apartment-3og-left.svg`,
  apt3Center: `${cadRoot}/apartment-3og-center.svg`,
  apt3Right: `${cadRoot}/apartment-3og-right.svg`,
  apt3Edge: `${cadRoot}/apartment-3og-edge.svg`,
  apt4Left: `${cadRoot}/apartment-4og-left.svg`,
  apt4Right: `${cadRoot}/apartment-4og-right.svg`,
  aptCombinedLong: `${cadRoot}/apartment-combined-long.svg`,
} as const;

type ApartmentHighlightManifest = Record<
  string,
  Record<string, ApartmentHighlight>
>;

type GeneratedCadApartmentHighlights = {
  floors: Record<string, { viewBox: string }>;
  apartments: ApartmentHighlightManifest;
};

const cadHighlightManifest =
  generatedCadApartmentHighlights as GeneratedCadApartmentHighlights;

function seed(input: ApartmentSeed): ApartmentSeed {
  return input;
}

const floor1Apartments = [
  seed({
    code: "WE 03",
    highlightCode: "WE 03.1",
    title: "2-Zimmer-Wohnung im Vorderhaus",
    section: "Vorderhaus",
    position: "Vorderhaus rechts",
    sqm: 88.1,
    rooms: 2,
    bedrooms: 1,
    bathrooms: 1,
    coldRent: 2466.8,
    balcony: true,
    gardenAccess: false,
    note: "Die Wohnung wird im vollständigen Geschossgrundriss verortet.",
    cadPlanSrc: cadPlans.apt1VhRight,
    planQuality: "typology",
    modelLabel: "Typologie Vorderhaus rechts, 1. Obergeschoss",
  }),
  seed({
    code: "WE 04",
    highlightCode: "WE 03.2",
    title: "2-Zimmer-Wohnung Vorderhaus und Seitenflügel",
    section: "Vorderhaus",
    position: "linker Seitenflügel + Vorderhaus links",
    sqm: 86.7,
    rooms: 2,
    bedrooms: 1,
    bathrooms: 1,
    coldRent: 2427.6,
    balcony: true,
    gardenAccess: false,
    note: "Die Wohnung wird im vollständigen Geschossgrundriss verortet.",
    cadPlanSrc: cadPlans.apt1VhLeft,
    planQuality: "typology",
    modelLabel: "Typologie Vorderhaus plus linker Seitenflügel",
  }),
  seed({
    code: "WE 05",
    highlightCode: "WE 04",
    title: "2-Zimmer-Wohnung im Vorderhaus",
    section: "Vorderhaus",
    position: "Vorderhaus links",
    sqm: 88,
    rooms: 2,
    bedrooms: 1,
    bathrooms: 1,
    coldRent: 2464,
    balcony: true,
    gardenAccess: false,
    note: "Die Wohnung wird im vollständigen Geschossgrundriss verortet.",
    cadPlanSrc: cadPlans.apt1VhLeft,
    planQuality: "exact",
    modelLabel: "Vorderhaus links, 1. Obergeschoss",
  }),
  seed({
    code: "WE 06",
    highlightCode: "WE 05",
    title: "2-Zimmer-Wohnung im Seitenflügel",
    section: "Seitenflügel",
    position: "rechter Seitenflügel rechts",
    sqm: 86.5,
    rooms: 2,
    bedrooms: 1,
    bathrooms: 1,
    coldRent: 2335.5,
    balcony: false,
    gardenAccess: false,
    note: "Die Wohnung wird im vollständigen Geschossgrundriss verortet.",
    cadPlanSrc: cadPlans.floor1,
    planQuality: "typology",
    modelLabel: "Typologie rechter Seitenflügel",
  }),
  seed({
    code: "WE 19",
    highlightCode: "WE 22",
    title: "2-Zimmer-Wohnung im Seitenflügel",
    section: "Seitenflügel",
    position: "linker Seitenflügel rechts",
    sqm: 64.8,
    rooms: 2,
    bedrooms: 1,
    bathrooms: 1,
    coldRent: 1749.6,
    balcony: false,
    gardenAccess: false,
    note: "Die Wohnung wird im vollständigen Geschossgrundriss verortet.",
    cadPlanSrc: cadPlans.floor1,
    planQuality: "typology",
    modelLabel: "Typologie linker Seitenflügel",
  }),
  seed({
    code: "WE 20",
    highlightCode: "WE 23",
    title: "2-Zimmer-Wohnung im Hinterhaus",
    section: "Hinterhaus",
    position: "Hinterhaus links",
    sqm: 59.7,
    rooms: 2,
    bedrooms: 1,
    bathrooms: 1,
    coldRent: 1611.9,
    balcony: true,
    gardenAccess: false,
    note: "Die Wohnung wird im vollständigen Geschossgrundriss verortet.",
    cadPlanSrc: cadPlans.apt1GhLeft,
    planQuality: "exact",
    modelLabel: "Hinterhaus links, 1. Obergeschoss",
  }),
  seed({
    code: "WE 21",
    highlightCode: "WE 24",
    title: "3-Zimmer-Wohnung im Seitenflügel",
    section: "Seitenflügel",
    position: "rechter Seitenflügel links",
    sqm: 82.3,
    rooms: 3,
    bedrooms: 2,
    bathrooms: 1,
    coldRent: 2139.8,
    balcony: true,
    gardenAccess: false,
    note: "Die Wohnung wird im vollständigen Geschossgrundriss verortet.",
    cadPlanSrc: cadPlans.floor1,
    planQuality: "typology",
    modelLabel: "Typologie rechter Seitenflügel",
  }),
  seed({
    code: "WE 22",
    highlightCode: "WE 25",
    title: "1-Zimmer-Wohnung im Hinterhaus",
    section: "Hinterhaus",
    position: "Hinterhaus rechts",
    sqm: 36.9,
    rooms: 1,
    bedrooms: 1,
    bathrooms: 1,
    coldRent: 1033.2,
    balcony: true,
    gardenAccess: false,
    note: "Die Wohnung wird im vollständigen Geschossgrundriss verortet.",
    cadPlanSrc: cadPlans.apt1GhRight,
    planQuality: "exact",
    modelLabel: "Hinterhaus rechts, 1. Obergeschoss",
  }),
];

const floor2Apartments = [
  seed({
    code: "WE 09",
    highlightCode: "WE 08",
    title: "3-Zimmer-Wohnung im Vorderhaus",
    section: "Vorderhaus",
    position: "Vorderhaus links",
    sqm: 119.8,
    rooms: 3,
    bedrooms: 2,
    bathrooms: 2,
    coldRent: 3234.6,
    balcony: true,
    gardenAccess: false,
    note: "Die Wohnung wird im vollständigen Geschossgrundriss verortet.",
    cadPlanSrc: cadPlans.apt2VhLeft,
    planQuality: "exact",
    modelLabel: "Vorderhaus links, 2. Obergeschoss",
  }),
  seed({
    code: "WE 08",
    highlightCode: "WE 07",
    title: "3-Zimmer-Wohnung im Vorderhaus",
    section: "Vorderhaus",
    position: "Vorderhaus rechts",
    sqm: 113.8,
    rooms: 3,
    bedrooms: 2,
    bathrooms: 2,
    coldRent: 3072.6,
    balcony: true,
    gardenAccess: false,
    note: "Die Wohnung wird im vollständigen Geschossgrundriss verortet.",
    cadPlanSrc: cadPlans.apt2VhRight,
    planQuality: "typology",
    modelLabel: "Typologie Vorderhaus rechts, 2. Obergeschoss",
  }),
  seed({
    code: "WE 07",
    highlightCode: "WE 06",
    title: "1-Zimmer-Wohnung im Seitenflügel",
    section: "Seitenflügel",
    position: "linker Seitenflügel links",
    sqm: 54.9,
    rooms: 1,
    bedrooms: 1,
    bathrooms: 1,
    coldRent: 1537.2,
    balcony: false,
    gardenAccess: false,
    note: "Die Wohnung wird im vollständigen Geschossgrundriss verortet.",
    cadPlanSrc: cadPlans.apt2SflLeft,
    planQuality: "exact",
    modelLabel: "linker Seitenflügel, 2. Obergeschoss",
  }),
  seed({
    code: "WE 23",
    highlightCode: "WE 26",
    title: "1-Zimmer-Wohnung im Seitenflügel",
    section: "Seitenflügel",
    position: "linker Seitenflügel rechts",
    sqm: 45.8,
    rooms: 1,
    bedrooms: 1,
    bathrooms: 1,
    coldRent: 1282.4,
    balcony: false,
    gardenAccess: false,
    note: "Die Wohnung wird im vollständigen Geschossgrundriss verortet.",
    cadPlanSrc: cadPlans.apt2SflRight,
    planQuality: "typology",
    modelLabel: "Typologie kompakte 1-Zimmer-Wohnung",
  }),
  seed({
    code: "WE 24",
    highlightCode: "WE 27",
    title: "3-Zimmer-Wohnung im Hinterhaus",
    section: "Hinterhaus",
    position: "Hinterhaus links",
    sqm: 81.7,
    rooms: 3,
    bedrooms: 2,
    bathrooms: 1,
    coldRent: 2124.2,
    balcony: true,
    gardenAccess: false,
    note: "Die Wohnung wird im vollständigen Geschossgrundriss verortet.",
    cadPlanSrc: cadPlans.floor2,
    planQuality: "typology",
    modelLabel: "Typologie Hinterhaus links",
    availability: "Vermietet",
  }),
  seed({
    code: "WE 25",
    highlightCode: "WE 28",
    title: "2-Zimmer-Wohnung im Hinterhaus",
    section: "Hinterhaus",
    position: "Hinterhaus rechts",
    sqm: 60.3,
    rooms: 2,
    bedrooms: 1,
    bathrooms: 1,
    coldRent: 1628.1,
    balcony: true,
    gardenAccess: false,
    note: "Die Wohnung wird im vollständigen Geschossgrundriss verortet.",
    cadPlanSrc: cadPlans.floor2,
    planQuality: "typology",
    modelLabel: "Typologie Hinterhaus rechts",
  }),
  seed({
    code: "WE 10",
    highlightCode: "WE 09",
    title: "1-Zimmer-Wohnung im Seitenflügel",
    section: "Seitenflügel",
    position: "rechter Seitenflügel rechts",
    sqm: 56.7,
    rooms: 1,
    bedrooms: 1,
    bathrooms: 1,
    coldRent: 1587.6,
    balcony: false,
    gardenAccess: false,
    note: "Die Wohnung wird im vollständigen Geschossgrundriss verortet.",
    cadPlanSrc: cadPlans.apt2SflRight,
    planQuality: "exact",
    modelLabel: "rechter Seitenflügel, 2. Obergeschoss",
  }),
  seed({
    code: "WE 26",
    highlightCode: "WE 29",
    title: "2-Zimmer-Wohnung im Seitenflügel",
    section: "Seitenflügel",
    position: "rechter Seitenflügel links",
    sqm: 69.1,
    rooms: 2,
    bedrooms: 1,
    bathrooms: 1,
    coldRent: 1865.7,
    balcony: true,
    gardenAccess: false,
    note: "Die Wohnung wird im vollständigen Geschossgrundriss verortet.",
    cadPlanSrc: cadPlans.apt2SflInnerLeft,
    planQuality: "exact",
    modelLabel: "rechter Seitenflügel, 2. Obergeschoss",
  }),
];

const floor3Apartments = [
  seed({
    code: "WE 12",
    highlightCode: "WE 12/13",
    title: "5-Zimmer-Wohnung Vorderhaus und Seitenflügel",
    section: "Vorderhaus",
    position: "Vorderhaus + rechter Seitenflügel links",
    sqm: 178.9,
    rooms: 5,
    bedrooms: 4,
    bathrooms: 2,
    coldRent: 4472.5,
    balcony: true,
    gardenAccess: false,
    note: "Die Wohnung wird im vollständigen Geschossgrundriss verortet.",
    cadPlanSrc: cadPlans.aptCombinedLong,
    planQuality: "exact",
    modelLabel: "Vorderhaus plus rechter Seitenflügel links",
  }),
  seed({
    code: "WE 11",
    highlightCode: "WE 10/11",
    title: "5-Zimmer-Wohnung Vorderhaus und Seitenflügel",
    section: "Vorderhaus",
    position: "Vorderhaus + linker Seitenflügel rechts",
    sqm: 179.1,
    rooms: 5,
    bedrooms: 4,
    bathrooms: 2,
    coldRent: 4477.5,
    balcony: true,
    gardenAccess: false,
    note: "Die Wohnung wird im vollständigen Geschossgrundriss verortet.",
    cadPlanSrc: cadPlans.aptCombinedLong,
    planQuality: "typology",
    modelLabel: "Typologie Vorderhaus plus linker Seitenflügel rechts",
  }),
  seed({
    code: "WE 27",
    highlightCode: "WE 30",
    title: "4-Zimmer-Wohnung im Hinterhaus",
    section: "Hinterhaus",
    position: "Hinterhaus + linker Seitenflügel links",
    sqm: 127.4,
    rooms: 4,
    bedrooms: 3,
    bathrooms: 2,
    coldRent: 3185,
    balcony: true,
    gardenAccess: false,
    note: "Die Wohnung wird im vollständigen Geschossgrundriss verortet.",
    cadPlanSrc: cadPlans.apt3Left,
    planQuality: "exact",
    modelLabel: "Hinterhaus links plus linker Seitenflügel",
  }),
  seed({
    code: "WE 28",
    highlightCode: "WE 31/32",
    title: "4-Zimmer-Wohnung im Hinterhaus",
    section: "Hinterhaus",
    position: "Hinterhaus + rechter Seitenflügel rechts",
    sqm: 126.1,
    rooms: 4,
    bedrooms: 3,
    bathrooms: 2,
    coldRent: 3152.5,
    balcony: true,
    gardenAccess: false,
    note: "Die Wohnung wird im vollständigen Geschossgrundriss verortet.",
    cadPlanSrc: cadPlans.apt3Right,
    planQuality: "typology",
    modelLabel: "Typologie Hinterhaus rechts plus rechter Seitenflügel",
  }),
];

const floor4Apartments = [
  seed({
    code: "WE 13",
    highlightCode: "WE 14/15",
    title: "5-Zimmer-Wohnung Vorderhaus und Seitenflügel",
    section: "Vorderhaus",
    position: "Vorderhaus + linker Seitenflügel rechts",
    sqm: 172.4,
    rooms: 5,
    bedrooms: 4,
    bathrooms: 2,
    coldRent: 4310,
    balcony: true,
    gardenAccess: false,
    note: "Die Wohnung wird im vollständigen Geschossgrundriss verortet.",
    cadPlanSrc: cadPlans.apt4Left,
    planQuality: "exact",
    modelLabel: "Vorderhaus plus linker Seitenflügel rechts",
  }),
  seed({
    code: "WE 14",
    highlightCode: "WE 16/17",
    title: "5-Zimmer-Wohnung Vorderhaus und Seitenflügel",
    section: "Vorderhaus",
    position: "Vorderhaus + rechter Seitenflügel links",
    sqm: 171.3,
    rooms: 5,
    bedrooms: 4,
    bathrooms: 2,
    coldRent: 4282.5,
    balcony: true,
    gardenAccess: false,
    note: "Die Wohnung wird im vollständigen Geschossgrundriss verortet.",
    cadPlanSrc: cadPlans.apt4Right,
    planQuality: "typology",
    modelLabel: "Typologie Vorderhaus plus rechter Seitenflügel links",
  }),
  seed({
    code: "WE 29",
    highlightCode: "WE 33/34",
    title: "4-Zimmer-Wohnung im Hinterhaus",
    section: "Hinterhaus",
    position: "Hinterhaus + linker Seitenflügel links",
    sqm: 129.3,
    rooms: 4,
    bedrooms: 3,
    bathrooms: 2,
    coldRent: 3232.5,
    balcony: true,
    gardenAccess: false,
    note: "Die Wohnung wird im vollständigen Geschossgrundriss verortet.",
    cadPlanSrc: cadPlans.apt4Left,
    planQuality: "typology",
    modelLabel: "Typologie Hinterhaus links plus linker Seitenflügel",
  }),
  seed({
    code: "WE 30",
    highlightCode: "WE 35/36",
    title: "4-Zimmer-Wohnung im Hinterhaus",
    section: "Hinterhaus",
    position: "Hinterhaus + rechter Seitenflügel rechts",
    sqm: 129.3,
    rooms: 4,
    bedrooms: 3,
    bathrooms: 2,
    coldRent: 3232.5,
    balcony: true,
    gardenAccess: false,
    note: "Die Wohnung wird im vollständigen Geschossgrundriss verortet.",
    cadPlanSrc: cadPlans.apt4Right,
    planQuality: "exact",
    modelLabel: "Hinterhaus rechts plus rechter Seitenflügel",
  }),
];

function createFloor(
  id: string,
  label: string,
  floorLabel: string,
  note: string,
  modelNote: string,
  cadFloorSrc: string,
  highlightViewBox: string,
  apartments: ApartmentSeed[],
): FloorPlanData {
  return {
    id,
    label,
    floorLabel,
    note,
    modelNote,
    cadFloorSrc,
    highlightViewBox,
    apartments: apartments.map((apartment) => ({
      ...apartment,
      id: `${id}-${apartment.code.replaceAll(/[^\d]+/g, "-")}`,
      floorId: id,
      floorLabel,
      availability: apartment.availability ?? "Auf Anfrage",
      highlight:
        cadHighlightManifest.apartments[id][
          apartment.highlightCode ?? apartment.code
        ],
    })),
  };
}

export const apartmentFloors: FloorPlanData[] = [
  createFloor(
    "1og",
    "1. OG",
    "1. Obergeschoss",
    "Die Wohnungen werden im vollständigen Geschossgrundriss gezeigt.",
    "Die Auswahl hebt die jeweilige Wohneinheit direkt im Plan hervor.",
    cadPlans.floor1,
    cadHighlightManifest.floors["1og"].viewBox,
    floor1Apartments,
  ),
  createFloor(
    "2og",
    "2. OG",
    "2. Obergeschoss",
    "Die Wohnungen werden im vollständigen Geschossgrundriss gezeigt.",
    "Die Auswahl hebt die jeweilige Wohneinheit direkt im Plan hervor.",
    cadPlans.floor2,
    cadHighlightManifest.floors["2og"].viewBox,
    floor2Apartments,
  ),
  createFloor(
    "3og",
    "3. OG",
    "3. Obergeschoss",
    "Die Wohnungen werden im vollständigen Geschossgrundriss gezeigt.",
    "Die Auswahl hebt die jeweilige Wohneinheit direkt im Plan hervor.",
    cadPlans.floor3,
    cadHighlightManifest.floors["3og"].viewBox,
    floor3Apartments,
  ),
  createFloor(
    "4og",
    "4. OG",
    "4. Obergeschoss",
    "Das obere Geschoss fasst die großen Verbundwohnungen übersichtlich zusammen.",
    "Die Auswahl hebt die jeweilige Wohneinheit direkt im Plan hervor.",
    cadPlans.floor4,
    cadHighlightManifest.floors["4og"].viewBox,
    floor4Apartments,
  ),
];

export const apartmentRenderGallery = [
  {
    id: "livingroom",
    title: "Wohnzimmer",
    subtitle: "Licht, Ruhe und Berliner Raumhöhe",
    imageSrc: "/rooms/livingroom.jpg",
    description:
      "Die Wohnräume bleiben unmöbliert und bewusst offen lesbar. Proportion, Tageslicht und Materialität sollen die Qualität des Altbaus tragen, ohne dekorativ zu werden.",
  },
  {
    id: "bathroom",
    title: "Bad",
    subtitle: "Zurückhaltend, hell und dauerhaft",
    imageSrc: "/rooms/bathroom.jpg",
    description:
      "Auch die Bäder sind vollständig eingebaut. Die Gestaltung bleibt bewusst zurückgenommen, damit Nutzung, Pflege und Dauerhaftigkeit im Vordergrund stehen.",
  },
  {
    id: "bedroom",
    title: "Schlafzimmer",
    subtitle: "Rückzug, Ruhe und klare Proportion",
    imageSrc: "/rooms/bedroom.png",
    description:
      "Die Schlafzimmer sind als ruhige Zonen gedacht. Licht, Material und Raumhöhe bleiben präsent, ohne den Rückzug zu stören oder zu überzeichnen.",
  },
] as const;
