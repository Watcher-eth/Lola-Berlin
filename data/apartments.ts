export type ApartmentStatus = "Verfügbar" | "Reserviert" | "Auf Anfrage";
export type HouseSection = "Vorderhaus" | "Seitenflügel" | "Hinterhaus";

export type ApartmentUnit = {
  id: string;
  code: string;
  title: string;
  floorId: string;
  floorLabel: string;
  section: HouseSection;
  position: string;
  sqm: number;
  bedrooms: number;
  bathrooms: number;
  price: number;
  availability: ApartmentStatus;
  balcony: boolean;
  gardenAccess: boolean;
  note: string;
  polygon: string;
  pin: { x: number; y: number };
  previewImageSrc?: string;
};

export type FloorPlanData = {
  id: string;
  label: string;
  planImageSrc: string;
  note: string;
  apartments: ApartmentUnit[];
};

type ApartmentBlueprint = Omit<
  ApartmentUnit,
  "id" | "code" | "floorId" | "floorLabel" | "price" | "availability"
> & {
  basePrice: number;
};

const lowerFloorBlueprints: ApartmentBlueprint[] = [
  {
    title: "Wohnung vorne links",
    section: "Vorderhaus",
    position: "vorne links",
    sqm: 55,
    bedrooms: 2,
    bathrooms: 1,
    balcony: true,
    gardenAccess: false,
    note: "Wohnung an der kurzen Vorderseite mit Balkon. Die gelieferten Einzelpläne für das 1. Obergeschoss verweisen auf diese Typologie.",
    polygon: "12,8 34,8 34,30 26,30 26,34 12,34",
    pin: { x: 23, y: 20 },
    previewImageSrc: "/apartment-plans/gh-1og-left-2zi.png",
    basePrice: 2140,
  },
  {
    title: "Wohnung vorne rechts",
    section: "Vorderhaus",
    position: "vorne rechts",
    sqm: 35,
    bedrooms: 1,
    bathrooms: 1,
    balcony: true,
    gardenAccess: false,
    note: "Kleinere Vorderhauswohnung an der kurzen Gebäudeseite mit Balkon.",
    polygon: "66,8 88,8 88,34 74,34 74,30 66,30",
    pin: { x: 77, y: 20 },
    previewImageSrc: "/apartment-plans/gh-1og-right-1zi.png",
    basePrice: 1620,
  },
  {
    title: "Seitenflügel links oben",
    section: "Seitenflügel",
    position: "linker Flügel, oberer Teil",
    sqm: 63,
    bedrooms: 2,
    bathrooms: 1,
    balcony: false,
    gardenAccess: false,
    note: "Wohnung im langen Seitenflügel. Auf den unteren beiden Ebenen wird der Flügel in zwei Einheiten gegliedert.",
    polygon: "4,24 27,24 27,48 4,48",
    pin: { x: 15.5, y: 36 },
    basePrice: 1960,
  },
  {
    title: "Seitenflügel links unten",
    section: "Seitenflügel",
    position: "linker Flügel, unterer Teil",
    sqm: 67,
    bedrooms: 2,
    bathrooms: 1,
    balcony: false,
    gardenAccess: false,
    note: "Zweite Wohnung im linken Seitenflügel der unteren Geschosse.",
    polygon: "4,52 27,52 27,80 4,80",
    pin: { x: 15.5, y: 66 },
    basePrice: 2040,
  },
  {
    title: "Seitenflügel rechts oben",
    section: "Seitenflügel",
    position: "rechter Flügel, oberer Teil",
    sqm: 61,
    bedrooms: 2,
    bathrooms: 1,
    balcony: false,
    gardenAccess: false,
    note: "Wohnung im rechten Seitenflügel der unteren Ebenen.",
    polygon: "73,24 96,24 96,48 73,48",
    pin: { x: 84.5, y: 36 },
    basePrice: 1920,
  },
  {
    title: "Seitenflügel rechts unten",
    section: "Seitenflügel",
    position: "rechter Flügel, unterer Teil",
    sqm: 65,
    bedrooms: 2,
    bathrooms: 1,
    balcony: false,
    gardenAccess: false,
    note: "Zweite Wohnung im rechten Seitenflügel der unteren Geschosse.",
    polygon: "73,52 96,52 96,80 73,80",
    pin: { x: 84.5, y: 66 },
    basePrice: 2010,
  },
  {
    title: "Wohnung hinten links",
    section: "Hinterhaus",
    position: "hinten links",
    sqm: 88,
    bedrooms: 3,
    bathrooms: 2,
    balcony: true,
    gardenAccess: false,
    note: "Große Wohnung an der kurzen Rückseite. Im Erdgeschoss mit direktem Gartenbezug.",
    polygon: "12,70 34,70 34,94 12,94",
    pin: { x: 23, y: 82 },
    basePrice: 2810,
  },
  {
    title: "Wohnung hinten rechts",
    section: "Hinterhaus",
    position: "hinten rechts",
    sqm: 91,
    bedrooms: 3,
    bathrooms: 2,
    balcony: true,
    gardenAccess: false,
    note: "Große Wohnung an der kurzen Rückseite mit ruhiger Orientierung zum Hof.",
    polygon: "66,70 88,70 88,94 66,94",
    pin: { x: 77, y: 82 },
    basePrice: 2890,
  },
];

const upperFloorBlueprints: ApartmentBlueprint[] = [
  {
    title: "Wohnung vorne links",
    section: "Vorderhaus",
    position: "vorne links",
    sqm: 122,
    bedrooms: 4,
    bathrooms: 2,
    balcony: true,
    gardenAccess: false,
    note: "Große Wohnung an der kurzen Vorderseite mit Balkon. Die gelieferte 4-Zimmer-Wohnung aus dem 3. Obergeschoss entspricht dieser Typologie.",
    polygon: "10,8 46,8 46,32 28,32 28,36 10,36",
    pin: { x: 28, y: 21 },
    previewImageSrc: "/apartment-plans/gh-3og-left-4zi.png",
    basePrice: 3380,
  },
  {
    title: "Wohnung vorne rechts",
    section: "Vorderhaus",
    position: "vorne rechts",
    sqm: 96,
    bedrooms: 3,
    bathrooms: 2,
    balcony: true,
    gardenAccess: false,
    note: "Große Vorderhauswohnung an der kurzen Straßenseite mit Balkon.",
    polygon: "54,8 90,8 90,36 72,36 72,32 54,32",
    pin: { x: 72, y: 21 },
    basePrice: 3120,
  },
  {
    title: "Seitenflügel links Mitte",
    section: "Seitenflügel",
    position: "linker Flügel mittig",
    sqm: 56,
    bedrooms: 2,
    bathrooms: 1,
    balcony: false,
    gardenAccess: false,
    note: "Kleinere Wohnung in der Mitte des linken Seitenflügels.",
    polygon: "4,34 27,34 27,74 4,74",
    pin: { x: 15.5, y: 54 },
    basePrice: 1880,
  },
  {
    title: "Seitenflügel rechts Mitte",
    section: "Seitenflügel",
    position: "rechter Flügel mittig",
    sqm: 59,
    bedrooms: 2,
    bathrooms: 1,
    balcony: false,
    gardenAccess: false,
    note: "Kleinere Wohnung in der Mitte des rechten Seitenflügels.",
    polygon: "73,34 96,34 96,74 73,74",
    pin: { x: 84.5, y: 54 },
    basePrice: 1910,
  },
  {
    title: "Wohnung hinten links",
    section: "Hinterhaus",
    position: "hinten links",
    sqm: 101,
    bedrooms: 3,
    bathrooms: 2,
    balcony: true,
    gardenAccess: false,
    note: "Große Hinterhauswohnung an der kurzen Rückseite mit Balkon zum Hof.",
    polygon: "10,70 46,70 46,94 28,94 28,90 10,90",
    pin: { x: 28, y: 82 },
    basePrice: 3010,
  },
  {
    title: "Wohnung hinten rechts",
    section: "Hinterhaus",
    position: "hinten rechts",
    sqm: 98,
    bedrooms: 3,
    bathrooms: 2,
    balcony: true,
    gardenAccess: false,
    note: "Große Hinterhauswohnung an der kurzen Rückseite mit ruhigem Außenbezug.",
    polygon: "54,70 90,70 90,90 72,90 72,94 54,94",
    pin: { x: 72, y: 82 },
    basePrice: 2970,
  },
];

function createApartments(
  floorId: string,
  floorLabel: string,
  prefix: string,
  blueprints: ApartmentBlueprint[],
  statuses: ApartmentStatus[],
  priceShift: number,
  overrides?: Partial<ApartmentBlueprint>[],
) {
  return blueprints.map((apartment, index) => ({
    ...apartment,
    ...(overrides?.[index] ?? {}),
    id: `${floorId}-${index + 1}`,
    code: `${prefix}.${String(index + 1).padStart(2, "0")}`,
    floorId,
    floorLabel,
    availability: statuses[index] ?? "Auf Anfrage",
    price: (overrides?.[index]?.basePrice ?? apartment.basePrice) + priceShift,
  }));
}

export const apartmentFloors: FloorPlanData[] = [
  {
    id: "eg",
    label: "EG",
    planImageSrc: "/floorplans/eg-invert.png",
    note: "Die unteren zwei Ebenen werden hier mit acht Wohnungen gelesen: zwei an der Vorderseite, zwei an der Rückseite und je zwei im linken und rechten Seitenflügel. Im Erdgeschoss haben die hinteren Einheiten Gartenzugang.",
    apartments: createApartments(
      "eg",
      "Erdgeschoss",
      "EG",
      lowerFloorBlueprints,
      [
        "Verfügbar",
        "Reserviert",
        "Verfügbar",
        "Auf Anfrage",
        "Verfügbar",
        "Reserviert",
        "Verfügbar",
        "Auf Anfrage",
      ],
      -120,
      [
        {},
        {},
        {},
        {},
        {},
        {},
        { gardenAccess: true, balcony: false },
        { gardenAccess: true, balcony: false },
      ],
    ),
  },
  {
    id: "1og",
    label: "1. OG",
    planImageSrc: "/floorplans/og2-invert.png",
    note: "Auf den unteren beiden Ebenen ist die Grundstruktur als Acht-Wohnungs-Typologie gelesen: Vorderhaus und Hinterhaus an den kurzen Seiten, dazu je zwei Wohnungen pro Seitenflügel.",
    apartments: createApartments(
      "1og",
      "1. Obergeschoss",
      "1",
      lowerFloorBlueprints,
      [
        "Verfügbar",
        "Verfügbar",
        "Reserviert",
        "Auf Anfrage",
        "Verfügbar",
        "Reserviert",
        "Auf Anfrage",
        "Verfügbar",
      ],
      0,
    ),
  },
  {
    id: "2og",
    label: "2. OG",
    planImageSrc: "/floorplans/og2-invert.png",
    note: "Die oberen drei Ebenen werden als Sechs-Wohnungs-Typologie geführt: zwei große Wohnungen vorne und hinten an den kurzen Seiten, dazu zwei kleinere Wohnungen mittig in den Seitenflügeln.",
    apartments: createApartments(
      "2og",
      "2. Obergeschoss",
      "2",
      upperFloorBlueprints,
      [
        "Auf Anfrage",
        "Verfügbar",
        "Reserviert",
        "Verfügbar",
        "Verfügbar",
        "Auf Anfrage",
      ],
      120,
    ),
  },
  {
    id: "3og",
    label: "3. OG",
    planImageSrc: "/floorplans/og2-invert.png",
    note: "Auch im 3. Obergeschoss bleibt die Sechs-Wohnungs-Typologie erhalten. Die gelieferte 4-Zimmer-Wohnung links hilft hier bei der Zuordnung der großen Vorderhaus-Einheit.",
    apartments: createApartments(
      "3og",
      "3. Obergeschoss",
      "3",
      upperFloorBlueprints,
      [
        "Verfügbar",
        "Auf Anfrage",
        "Reserviert",
        "Verfügbar",
        "Auf Anfrage",
        "Verfügbar",
      ],
      230,
    ),
  },
  {
    id: "dg",
    label: "DG",
    planImageSrc: "/floorplans/og2-invert.png",
    note: "Bis der finale Dachgeschoss-Grundriss vorliegt, bleibt diese Ebene als Sechs-Wohnungs-Studie entlang derselben Gebäudelogik markiert.",
    apartments: createApartments(
      "dg",
      "Dachgeschoss",
      "DG",
      upperFloorBlueprints,
      [
        "Auf Anfrage",
        "Verfügbar",
        "Auf Anfrage",
        "Reserviert",
        "Verfügbar",
        "Auf Anfrage",
      ],
      360,
      [
        { sqm: 128, bedrooms: 4, bathrooms: 2, basePrice: 3720 },
        { sqm: 104, bedrooms: 3, bathrooms: 2, basePrice: 3380 },
        { sqm: 59, bedrooms: 2, bathrooms: 1, basePrice: 2140 },
        { sqm: 61, bedrooms: 2, bathrooms: 1, basePrice: 2190 },
        { sqm: 109, bedrooms: 3, bathrooms: 2, basePrice: 3460 },
        { sqm: 106, bedrooms: 3, bathrooms: 2, basePrice: 3410 },
      ],
    ),
  },
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
