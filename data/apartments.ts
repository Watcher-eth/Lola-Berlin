export type ApartmentStatus = "Verfügbar" | "Reserviert" | "Auf Anfrage";
export type HouseSection = "Vorderhaus" | "Seitenflügel" | "Hinterhaus";

export type PlanBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
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
  rentPerSqm: number;
  price: number;
  availability: ApartmentStatus;
  balcony: boolean;
  gardenAccess: boolean;
  note: string;
  bounds: PlanBounds;
  planImageSrc: string;
  sourcePdfSrc: string;
  modelLabel: string;
};

export type FloorPlanData = {
  id: string;
  label: string;
  floorLabel: string;
  planImageSrc: string;
  note: string;
  modelNote: string;
  apartments: ApartmentUnit[];
};

type ApartmentSeed = Omit<
  ApartmentUnit,
  "id" | "floorId" | "floorLabel" | "rentPerSqm" | "price" | "availability"
>;

const planRoot = "/apartment-plans/generated";
const pdfRoot = "/newfloorplans";

const floorPlanImage = "/floorplans/og2-invert.png";

const actualPlans: Record<string, ApartmentSeed> = {
  gh1Left: {
    code: "WE 23",
    title: "2-Zimmer-Wohnung im Hinterhaus",
    section: "Hinterhaus",
    position: "links",
    sqm: 59.7,
    rooms: 2,
    bedrooms: 1,
    bathrooms: 1,
    balcony: true,
    gardenAccess: false,
    note: "Kompakter Hinterhaus-Grundriss mit klarer Trennung von Wohnraum, Schlafraum und Nebenräumen.",
    bounds: { x: 12, y: 70, width: 23, height: 24 },
    planImageSrc: `${planRoot}/gh-1og-left-59qm.png`,
    sourcePdfSrc: `${pdfRoot}/Hol18  2-Zi Whg 59,7 qm  GH 1.OG li.pdf`,
    modelLabel: "Hinterhaus links, untere Geschosse",
  },
  gh1Right: {
    code: "WE 25",
    title: "1-Zimmer-Wohnung im Hinterhaus",
    section: "Hinterhaus",
    position: "rechts",
    sqm: 36.9,
    rooms: 1,
    bedrooms: 1,
    bathrooms: 1,
    balcony: true,
    gardenAccess: false,
    note: "Kleine Einheit mit direkter, effizienter Raumfolge und Balkonbezug.",
    bounds: { x: 66, y: 70, width: 22, height: 24 },
    planImageSrc: `${planRoot}/gh-1og-right-36qm.png`,
    sourcePdfSrc: `${pdfRoot}/Hol18  1-Zi Whg 36,9 qm GH 1.OG re.pdf`,
    modelLabel: "Hinterhaus rechts, untere Geschosse",
  },
  vh1Left: {
    code: "WE 04",
    title: "2-Zimmer-Wohnung im Vorderhaus",
    section: "Vorderhaus",
    position: "links",
    sqm: 88,
    rooms: 2,
    bedrooms: 1,
    bathrooms: 1,
    balcony: true,
    gardenAccess: false,
    note: "Breitere Vorderhaus-Typologie mit Wohnräumen zur Straße und ruhigerer Nebenraumzone.",
    bounds: { x: 10, y: 8, width: 36, height: 28 },
    planImageSrc: `${planRoot}/vh-1og-left-88qm.png`,
    sourcePdfSrc: `${pdfRoot}/Hol18  -Zi Whg 88 qm VH 1.OG li.pdf`,
    modelLabel: "Vorderhaus links, 1. Obergeschoss",
  },
  vh2Left: {
    code: "WE 08",
    title: "3-Zimmer-Wohnung im Vorderhaus",
    section: "Vorderhaus",
    position: "links",
    sqm: 119.8,
    rooms: 3,
    bedrooms: 2,
    bathrooms: 2,
    balcony: true,
    gardenAccess: false,
    note: "Großzügige Vorderhauswohnung mit repräsentativer Zimmerfolge und Balkonzone.",
    bounds: { x: 10, y: 8, width: 36, height: 28 },
    planImageSrc: `${planRoot}/vh-2og-left-119qm.png`,
    sourcePdfSrc: `${pdfRoot}/Hol18 3-Zi Whg 119,80 qm  VH 2.OG li.pdf`,
    modelLabel: "Vorderhaus links, mittlere Geschosse",
  },
  sfl2LeftCompact: {
    code: "WE 06",
    title: "1-Zimmer-Wohnung im Seitenflügel",
    section: "Seitenflügel",
    position: "links",
    sqm: 54.9,
    rooms: 1,
    bedrooms: 1,
    bathrooms: 1,
    balcony: false,
    gardenAccess: false,
    note: "Kompakter Seitenflügeltyp mit kurzer Erschließung und effizienter Nassraumlage.",
    bounds: { x: 4, y: 34, width: 23, height: 40 },
    planImageSrc: `${planRoot}/sfl-2og-left-54qm.png`,
    sourcePdfSrc: `${pdfRoot}/Hol18 -Zi Whg 54,9 qm li Sfl 2.OG li.pdf`,
    modelLabel: "Seitenflügel links, kompakt",
  },
  sfl2Left: {
    code: "WE 29",
    title: "2-Zimmer-Wohnung im Seitenflügel",
    section: "Seitenflügel",
    position: "links",
    sqm: 69.1,
    rooms: 2,
    bedrooms: 1,
    bathrooms: 1,
    balcony: false,
    gardenAccess: false,
    note: "Längerer Seitenflügelgrundriss, der die Tiefe des Gebäudes für Wohnen und Rückzug nutzt.",
    bounds: { x: 4, y: 34, width: 23, height: 40 },
    planImageSrc: `${planRoot}/sfl-2og-left-69qm.png`,
    sourcePdfSrc: `${pdfRoot}/Hol18 2-Zi Whg 69,10 qm  Sfl re 2.OG li.pdf`,
    modelLabel: "Seitenflügel links, groß",
  },
  sfl2Right: {
    code: "WE 09",
    title: "1-Zimmer-Wohnung im Seitenflügel",
    section: "Seitenflügel",
    position: "rechts",
    sqm: 56.7,
    rooms: 1,
    bedrooms: 1,
    bathrooms: 1,
    balcony: false,
    gardenAccess: false,
    note: "Rechter Seitenflügeltyp mit kompaktem Zuschnitt und ruhiger Hoforientierung.",
    bounds: { x: 73, y: 34, width: 23, height: 40 },
    planImageSrc: `${planRoot}/sfl-2og-right-56qm.png`,
    sourcePdfSrc: `${pdfRoot}/Hol18 Zi Whg 56,70 qm  Sfl re 2.OG re.pdf`,
    modelLabel: "Seitenflügel rechts",
  },
  gh3Left: {
    code: "WE 30",
    title: "4-Zimmer-Wohnung im Hinterhaus",
    section: "Hinterhaus",
    position: "links",
    sqm: 127.4,
    rooms: 4,
    bedrooms: 3,
    bathrooms: 2,
    balcony: true,
    gardenAccess: false,
    note: "Großer Hinterhausgrundriss mit mehreren Individualräumen und deutlicher Wohnzone.",
    bounds: { x: 10, y: 70, width: 36, height: 24 },
    planImageSrc: `${planRoot}/gh-3og-left-127qm.png`,
    sourcePdfSrc: `${pdfRoot}/Hol18  4-Zi Whg 127,4 qm GH  3.OG li.pdf`,
    modelLabel: "Hinterhaus links, obere Geschosse",
  },
  vh3LeftSflRight: {
    code: "WE 12/13",
    title: "5-Zimmer-Wohnung Vorderhaus und Seitenflügel",
    section: "Vorderhaus",
    position: "links mit rechtem Seitenflügel",
    sqm: 178.9,
    rooms: 5,
    bedrooms: 4,
    bathrooms: 2,
    balcony: true,
    gardenAccess: false,
    note: "Große Ecktypologie, die Vorderhaus und Seitenflügel verbindet und damit eine weit gespannte Wohnfolge schafft.",
    bounds: { x: 10, y: 8, width: 86, height: 66 },
    planImageSrc: `${planRoot}/vh-3og-left-sfl-right-178qm.png`,
    sourcePdfSrc: `${pdfRoot}/Hol18  5-Zi Whg 178,90 qm VH 3.OG l,i SFL re.pdf`,
    modelLabel: "Vorderhaus links plus Seitenflügel rechts",
  },
  gh4Right: {
    code: "WE 35/36",
    title: "4-Zimmer-Wohnung im Hinterhaus",
    section: "Hinterhaus",
    position: "rechts",
    sqm: 129.3,
    rooms: 4,
    bedrooms: 3,
    bathrooms: 2,
    balcony: true,
    gardenAccess: false,
    note: "Rechte Hinterhaus-Typologie mit großzügigem Zuschnitt und Balkonbezug.",
    bounds: { x: 54, y: 70, width: 36, height: 24 },
    planImageSrc: `${planRoot}/gh-4og-right-129qm.png`,
    sourcePdfSrc: `${pdfRoot}/Hol18 4-Zi Whg 129,3 qm GH 4.OG re.pdf`,
    modelLabel: "Hinterhaus rechts, obere Geschosse",
  },
  vh4RightSflLeft: {
    code: "WE 14/15",
    title: "5-Zimmer-Wohnung Vorderhaus und Seitenflügel",
    section: "Vorderhaus",
    position: "rechts mit linkem Seitenflügel",
    sqm: 172.4,
    rooms: 5,
    bedrooms: 4,
    bathrooms: 2,
    balcony: true,
    gardenAccess: false,
    note: "Spiegeltyp zur großen Eckwohnung: Vorderhaus und Seitenflügel werden zu einer zusammenhängenden Familienwohnung.",
    bounds: { x: 4, y: 8, width: 86, height: 66 },
    planImageSrc: `${planRoot}/vh-4og-right-sfl-left-172qm.png`,
    sourcePdfSrc: `${pdfRoot}/Hol18  5 Zi Whg 172,4 qm VH 4.OG re , Sfl li.pdf`,
    modelLabel: "Vorderhaus rechts plus Seitenflügel links",
  },
};

function createFloor(
  id: string,
  label: string,
  floorLabel: string,
  note: string,
  modelNote: string,
  plans: ApartmentSeed[],
  statuses: ApartmentStatus[],
  rentPerSqm: number,
): FloorPlanData {
  return {
    id,
    label,
    floorLabel,
    planImageSrc: floorPlanImage,
    note,
    modelNote,
    apartments: plans.map((plan, index) => ({
      ...plan,
      id: `${id}-${index + 1}`,
      floorId: id,
      floorLabel,
      rentPerSqm,
      availability: statuses[index] ?? "Auf Anfrage",
      price: Math.round(plan.sqm * rentPerSqm),
    })),
  };
}

export const apartmentFloors: FloorPlanData[] = [
  createFloor(
    "1og",
    "1. OG",
    "1. Obergeschoss",
    "Die neue Grundrissbasis ergänzt die bisherigen Geschosspläne mit konkreten Einzelwohnungen für Vorderhaus und Hinterhaus.",
    "Diese Ebene modelliert die kleineren Hinterhaus-Typen und eine größere Vorderhauswohnung.",
    [actualPlans.vh1Left, actualPlans.gh1Left, actualPlans.gh1Right],
    ["Verfügbar", "Reserviert", "Verfügbar"],
    25,
  ),
  createFloor(
    "2og",
    "2. OG",
    "2. Obergeschoss",
    "Das 2. Obergeschoss zeigt die meisten wiederholbaren Seitenflügel-Typen und die größere Vorderhauslogik.",
    "Diese vier Typen decken die mittleren Etagen am breitesten ab.",
    [
      actualPlans.vh2Left,
      actualPlans.sfl2LeftCompact,
      actualPlans.sfl2Left,
      actualPlans.sfl2Right,
    ],
    ["Auf Anfrage", "Verfügbar", "Reserviert", "Verfügbar"],
    26,
  ),
  createFloor(
    "3og",
    "3. OG",
    "3. Obergeschoss",
    "Im 3. Obergeschoss treten die großen zusammenhängenden Wohnungen auf, die Vorderhaus und Seitenflügel verbinden.",
    "Die große Eckwohnung und der Hinterhausplan dienen als Vorlage für die oberen Geschosse.",
    [actualPlans.vh3LeftSflRight, actualPlans.gh3Left],
    ["Verfügbar", "Auf Anfrage"],
    27,
  ),
  createFloor(
    "4og",
    "4. OG",
    "4. Obergeschoss",
    "Das 4. Obergeschoss spiegelt die große Ecktypologie und ergänzt die rechte Hinterhausvariante.",
    "Diese Ebene beschreibt die obere Geschosslogik mit gespiegelter Seitenflügel-Zuordnung.",
    [actualPlans.vh4RightSflLeft, actualPlans.gh4Right],
    ["Verfügbar", "Reserviert"],
    28,
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
    id: "kitchen",
    title: "Küche",
    subtitle: "Fest eingebaut, nicht aufgesetzt",
    imageSrc: "/rooms/kitchen.jpg",
    description:
      "Jede Wohnung kommt mit integrierter Küche. Sie ist Teil der Architektur und nicht nur ein späteres Add-on, damit der Alltag präzise und ruhig organisiert bleibt.",
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
