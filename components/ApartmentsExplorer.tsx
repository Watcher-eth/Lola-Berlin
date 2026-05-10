import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ApartmentInquiryDialog } from "@/components/ApartmentInquiryDialog";
import { apartmentFloors } from "@/data/apartments";

const euroFormatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

function parsePolygon(points: string) {
  return points.split(" ").map((pair) => {
    const [x, y] = pair.split(",").map(Number);
    return { x, y };
  });
}

function getPolygonBounds(points: { x: number; y: number }[]) {
  const minX = Math.min(...points.map((point) => point.x));
  const maxX = Math.max(...points.map((point) => point.x));
  const minY = Math.min(...points.map((point) => point.y));
  const maxY = Math.max(...points.map((point) => point.y));

  return { minX, maxX, minY, maxY };
}

function ApartmentPlanPreview({
  imageSrc,
  polygon,
  alt,
}: {
  imageSrc: string;
  polygon: string;
  alt: string;
}) {
  const parsedPoints = parsePolygon(polygon);
  const bounds = getPolygonBounds(parsedPoints);
  const padding = 4;
  const x = Math.max(0, bounds.minX - padding);
  const y = Math.max(0, bounds.minY - padding);
  const width = Math.min(100 - x, bounds.maxX - bounds.minX + padding * 2);
  const height = Math.min(100 - y, bounds.maxY - bounds.minY + padding * 2);
  const previewId = `clip-${polygon.replaceAll(/[^\d.]+/g, "-")}`;

  return (
    <div className="relative aspect-[1.08/1] overflow-hidden bg-[#f4efe6]">
      <svg
        viewBox={`${x} ${y} ${width} ${height}`}
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label={alt}
      >
        <defs>
          <clipPath id={previewId} clipPathUnits="userSpaceOnUse">
            <polygon points={polygon} />
          </clipPath>
        </defs>

        <rect x="0" y="0" width="100" height="100" fill="#f4efe6" />
        <image
          href={imageSrc}
          x="0"
          y="0"
          width="100"
          height="100"
          preserveAspectRatio="none"
          clipPath={`url(#${previewId})`}
        />
        <polygon
          points={polygon}
          fill="none"
          stroke="#4b492d"
          strokeWidth="0.9"
        />
      </svg>
    </div>
  );
}

function ApartmentPreview({
  previewImageSrc,
  floorImageSrc,
  polygon,
  alt,
}: {
  previewImageSrc?: string;
  floorImageSrc: string;
  polygon: string;
  alt: string;
}) {
  if (previewImageSrc) {
    return (
      <div className="relative aspect-[1271/1800] overflow-hidden bg-[#f4efe6]">
        <Image
          src={previewImageSrc}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 34vw, 100vw"
          className="object-contain"
        />
      </div>
    );
  }

  return (
    <ApartmentPlanPreview imageSrc={floorImageSrc} polygon={polygon} alt={alt} />
  );
}

export function ApartmentsExplorer() {
  const [selectedFloorId, setSelectedFloorId] = useState(apartmentFloors[0].id);
  const [selectedApartmentId, setSelectedApartmentId] = useState(
    apartmentFloors[0].apartments[0]?.id ?? "",
  );
  const [hoveredApartmentId, setHoveredApartmentId] = useState<string | null>(
    null,
  );
  const [inquiryOpen, setInquiryOpen] = useState(false);

  const selectedFloor =
    apartmentFloors.find((floor) => floor.id === selectedFloorId) ??
    apartmentFloors[0];

  const activeApartment =
    selectedFloor.apartments.find(
      (apartment) => apartment.id === selectedApartmentId,
    ) ?? selectedFloor.apartments[0];

  const hoveredApartment =
    selectedFloor.apartments.find(
      (apartment) => apartment.id === hoveredApartmentId,
    ) ?? null;

  return (
    <section className="border-t border-[var(--accent)]/14 bg-[#f7f3eb] px-6 py-16 sm:px-8 lg:px-10 lg:py-24">
      <div className="mx-auto w-full max-w-7xl">
        <div className="-mx-1 flex flex-wrap items-end gap-2 overflow-x-auto px-1 pb-1 sm:mx-0 sm:gap-3 sm:overflow-visible sm:px-0 sm:pb-0">
          {apartmentFloors.map((floor) => {
            const active = selectedFloorId === floor.id;

            return (
              <button
                key={floor.id}
                type="button"
                onClick={() => setSelectedFloorId(floor.id)}
                className={`min-w-[76px] border px-3 py-3 text-left transition-colors duration-300 sm:min-w-[86px] sm:px-4 ${
                  active
                    ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                    : "border-[var(--accent)]/18 bg-white/60 text-[var(--accent)] hover:border-[var(--accent)]/48 hover:bg-white"
                }`}
              >
                <span className="block font-serif text-xl leading-none sm:text-2xl">
                  {floor.label}
                </span>
                <span
                  className={`mt-2 block font-mono text-[10px] uppercase tracking-[0.18em] ${
                    active ? "text-white/68" : "text-[var(--accent)]/58"
                  }`}
                >
                  {floor.apartments.length} Apt.
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-8">
          <p className="max-w-3xl text-sm leading-6 text-black/54 sm:leading-7">
            {selectedFloor.note}
          </p>
        </div>

        <div className="mt-10">
          <div className="relative aspect-[1170/855] overflow-hidden">
            <Image
              src={selectedFloor.planImageSrc}
              alt={`Grundriss ${selectedFloor.label}`}
              fill
              sizes="100vw"
              className="object-contain"
            />

            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 h-full w-full"
              aria-hidden="true"
            >
              {selectedFloor.apartments.map((apartment) => {
                const active = activeApartment?.id === apartment.id;
                const hovered = hoveredApartment?.id === apartment.id;

                return (
                  <polygon
                    key={apartment.id}
                    points={apartment.polygon}
                    fill={
                      active
                        ? "rgba(75,73,45,0.24)"
                        : hovered
                          ? "rgba(75,73,45,0.14)"
                          : "rgba(75,73,45,0.05)"
                    }
                    stroke="rgba(75,73,45,0.8)"
                    strokeWidth={active ? "0.75" : "0.45"}
                    className="cursor-pointer transition-opacity duration-300"
                    onMouseEnter={() => setHoveredApartmentId(apartment.id)}
                    onMouseLeave={() => setHoveredApartmentId(null)}
                    onClick={() => setSelectedApartmentId(apartment.id)}
                  />
                );
              })}
            </svg>

            <AnimatePresence>
              {hoveredApartment ? (
                <motion.div
                  className="pointer-events-none absolute z-10 hidden -translate-x-1/2 -translate-y-[110%] md:block"
                  style={{
                    left: `${hoveredApartment.pin.x}%`,
                    top: `${hoveredApartment.pin.y}%`,
                  }}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="bg-white px-4 py-3 text-[var(--ink)] shadow-[0_18px_40px_rgba(0,0,0,0.12)]">
                    <p className="font-serif text-2xl leading-none tracking-[-0.04em] text-[var(--accent)]">
                      {hoveredApartment.code}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-black/62">
                      {hoveredApartment.title}
                    </p>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(320px,0.9fr)_minmax(0,1.1fr)] lg:items-start">
          <div className="overflow-hidden">
            <ApartmentPreview
              previewImageSrc={activeApartment.previewImageSrc}
              floorImageSrc={selectedFloor.planImageSrc}
              polygon={activeApartment.polygon}
              alt={`Grundrissausschnitt ${activeApartment.code}`}
            />
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)]/62">
              Gewählte Wohnung
            </p>
            <h3 className="mt-4 font-serif text-4xl leading-none tracking-[-0.05em] text-[var(--accent)] sm:text-5xl">
              {activeApartment.code}
            </h3>
            <p className="mt-3 text-lg leading-7 text-black/72 sm:text-xl sm:leading-8">
              {activeApartment.title}
            </p>

            <div className="mt-8 grid gap-6 text-sm leading-7 text-black/66 sm:grid-cols-2">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]/58">
                  Bauteil
                </p>
                <p className="mt-1 text-base text-black/78">
                  {activeApartment.section}
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]/58">
                  Position
                </p>
                <p className="mt-1 text-base text-black/78">
                  {activeApartment.position}
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]/58">
                  Fläche
                </p>
                <p className="mt-1 text-base text-black/78">
                  {activeApartment.sqm} m²
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]/58">
                  Etage
                </p>
                <p className="mt-1 text-base text-black/78">
                  {activeApartment.floorLabel}
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]/58">
                  Zimmer
                </p>
                <p className="mt-1 text-base text-black/78">
                  {activeApartment.bedrooms}
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]/58">
                  Bäder
                </p>
                <p className="mt-1 text-base text-black/78">
                  {activeApartment.bathrooms}
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]/58">
                  Außenraum
                </p>
                <p className="mt-1 text-base text-black/78">
                  {activeApartment.gardenAccess
                    ? "Gartenzugang"
                    : activeApartment.balcony
                      ? "Balkon"
                      : "Kein Außenraum"}
                </p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]/58">
                  Status
                </p>
                <p className="mt-1 text-base text-black/78">
                  {activeApartment.availability}
                </p>
              </div>
            </div>

            <p className="mt-8 text-2xl leading-none text-[var(--accent)] sm:text-3xl">
              {euroFormatter.format(activeApartment.price)}
            </p>

            <p className="mt-6 max-w-xl text-sm leading-7 text-black/64 sm:text-base sm:leading-8">
              {activeApartment.note}
            </p>

            <p className="mt-6 max-w-xl text-sm leading-7 text-black/54">
              Alle Wohnungen sind unmöbliert. Küche und Bad sind fest eingebaut
              und Teil der architektonischen Grundausstattung.
            </p>

            <div className="mt-8">
              <button
                type="button"
                onClick={() => setInquiryOpen(true)}
                className="w-full bg-[var(--accent)] px-7 py-4 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:bg-black"
              >
                Anfragen
              </button>
            </div>
          </div>
        </div>
      </div>

      <ApartmentInquiryDialog
        open={inquiryOpen}
        onOpenChange={setInquiryOpen}
        apartmentCode={activeApartment.code}
        apartmentTitle={activeApartment.title}
        floorLabel={activeApartment.floorLabel}
      />
    </section>
  );
}
