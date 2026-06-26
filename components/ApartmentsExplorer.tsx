import Image from "next/image";
import { KeyboardEvent, ReactNode, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { ApartmentInquiryDialog } from "@/components/ApartmentInquiryDialog";
import {
  apartmentFloors,
  ApartmentUnit,
  FloorPlanData,
} from "@/data/apartments";

const planTransition = {
  type: "spring",
  stiffness: 82,
  damping: 20,
  mass: 0.9,
} as const;

const floorMediaClassName = "absolute inset-0 px-4 py-9 sm:px-7 sm:py-11";
const floorImageClassName = "object-contain contrast-[1.18]";
function apartmentHighlightValue(apartment: ApartmentUnit | null) {
  return apartment?.availability === "Vermietet" ? "#FF3B30" : "#007AFF";
}

function ApartmentFact({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]/58">
        {label}
      </p>
      <p className="mt-1 text-base text-black/78">{value}</p>
    </div>
  );
}

function formatColdRent(apartment: ApartmentUnit) {
  if (!apartment.coldRent) return "Auf Anfrage";

  return `${apartment.coldRent.toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} kalt`;
}

function getOutdoorSpaceLabel(apartment: ApartmentUnit) {
  if (apartment.gardenAccess) return "Gartenzugang";
  if (apartment.balcony) return "Balkon";
  return "Nein";
}

function handlePlanKeySelect(
  event: KeyboardEvent<SVGPathElement>,
  apartmentId: string,
  onSelect: (apartmentId: string) => void,
) {
  if (event.key !== "Enter" && event.key !== " ") return;
  event.preventDefault();
  onSelect(apartmentId);
}

function ApartmentFloorOverlay({
  floor,
  activeApartment,
  previewApartment,
  onSelect,
  onPreview,
  onPreviewEnd,
}: {
  floor: FloorPlanData;
  activeApartment: ApartmentUnit | null;
  previewApartment: ApartmentUnit | null;
  onSelect: (apartmentId: string) => void;
  onPreview: (apartmentId: string) => void;
  onPreviewEnd: () => void;
}) {
  const highlightedApartment = previewApartment ?? activeApartment;

  return (
    <div className={`${floorMediaClassName} z-20`}>
      <AnimatePresence mode="wait">
        {highlightedApartment ? (
          <motion.div
            key={highlightedApartment.id}
            className="pointer-events-none absolute inset-0 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image
              src={highlightedApartment.highlight.overlaySrc}
              alt=""
              fill
              unoptimized
              sizes="(min-width: 1024px) 70vw, 94vw"
              className={floorImageClassName}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <svg
        viewBox={floor.highlightViewBox}
        className="relative z-20 h-full w-full overflow-visible"
        preserveAspectRatio="xMidYMid meet"
        aria-label={`Wohnungen im ${floor.floorLabel}`}
      >
        {floor.apartments.map((apartment) => {
          return (
            <path
              key={`${apartment.id}-hit`}
              d={apartment.highlight.hitPath}
              role="button"
              tabIndex={0}
              aria-label={`${apartment.code} im Grundriss markieren`}
              onFocus={() => onPreview(apartment.id)}
              onBlur={onPreviewEnd}
              onPointerEnter={() => onPreview(apartment.id)}
              onPointerMove={() => onPreview(apartment.id)}
              onPointerLeave={onPreviewEnd}
              onClick={() => onSelect(apartment.id)}
              onKeyDown={(event) =>
                handlePlanKeySelect(event, apartment.id, onSelect)
              }
              fill="transparent"
              stroke="transparent"
              strokeWidth="0"
              vectorEffect="non-scaling-stroke"
              className="cursor-pointer outline-none"
            />
          );
        })}

        <AnimatePresence mode="wait">
          {highlightedApartment ? (
            <motion.g
              key={highlightedApartment.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-none"
            >
              <text
                x={highlightedApartment.highlight.label.x}
                y={highlightedApartment.highlight.label.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={apartmentHighlightValue(highlightedApartment)}
                className="font-mono text-[1.25px] uppercase tracking-[0.16em]"
                paintOrder="stroke"
                stroke="#f8f6ef"
                strokeWidth="0.54"
                vectorEffect="non-scaling-stroke"
              >
                {highlightedApartment.code}
              </text>
            </motion.g>
          ) : null}
        </AnimatePresence>
      </svg>
    </div>
  );
}

function CadPlanSurface({
  floor,
  activeApartment,
  hoverApartment,
  onSelect,
  onPreview,
  onPreviewEnd,
}: {
  floor: FloorPlanData;
  activeApartment: ApartmentUnit | null;
  hoverApartment: ApartmentUnit | null;
  onSelect: (apartmentId: string) => void;
  onPreview: (apartmentId: string) => void;
  onPreviewEnd: () => void;
}) {
  const displayedApartment = hoverApartment ?? activeApartment;

  return (
    <motion.div
      layout
      transition={planTransition}
      className="overflow-hidden border border-[var(--accent)]/12 bg-[#f8f6ef] shadow-[0_24px_70px_rgba(75,73,45,0.1)]"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-3 z-30 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--accent)]/62 sm:top-4"
        >
          Hinterhaus / Garten
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-3 z-30 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--accent)]/62 sm:bottom-4"
        >
          Vorderhaus
        </div>

        <div className={floorMediaClassName}>
          <Image
            src={floor.cadFloorSrc}
            alt={`Grundriss ${floor.floorLabel}`}
            fill
            unoptimized
            priority
            sizes="(min-width: 1024px) 70vw, 94vw"
            className={floorImageClassName}
          />
        </div>

        <ApartmentFloorOverlay
          floor={floor}
          activeApartment={activeApartment}
          previewApartment={hoverApartment}
          onSelect={onSelect}
          onPreview={onPreview}
          onPreviewEnd={onPreviewEnd}
        />
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-[var(--accent)]/12 bg-white/58 px-4 py-3 text-[10px] uppercase tracking-[0.16em] text-[var(--accent)]/64">
        <span className="inline-flex items-center gap-2">
          <span
            className="h-px w-8"
            style={{ backgroundColor: apartmentHighlightValue(displayedApartment) }}
          />
          {displayedApartment
            ? `${displayedApartment.code} · ${displayedApartment.title}`
            : "Wohnung auswählen"}
        </span>
        <span>Wohnung im Plan anklicken</span>
      </div>
    </motion.div>
  );
}

function ApartmentDetailsPanel({
  floor,
  activeApartment,
  previewApartmentId,
  onSelect,
  onPreview,
  onPreviewEnd,
  onInquiry,
}: {
  floor: FloorPlanData;
  activeApartment: ApartmentUnit | null;
  previewApartmentId: string | null;
  onSelect: (apartmentId: string) => void;
  onPreview: (apartmentId: string) => void;
  onPreviewEnd: () => void;
  onInquiry: () => void;
}) {
  const inquiryDisabled =
    !activeApartment || activeApartment.availability === "Vermietet";

  return (
    <aside className="border border-[var(--accent)]/14 bg-white/54 p-5 sm:p-6">
      <AnimatePresence mode="wait">
        {activeApartment ? (
          <motion.div
            key={activeApartment.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)]/62">
              Gewählte Wohnung
            </p>
            <h3 className="mt-4 font-serif text-4xl leading-none text-[var(--accent)] sm:text-5xl">
              {activeApartment.code}
            </h3>
            <p className="mt-3 text-lg leading-7 text-black/72 sm:text-xl sm:leading-8">
              {activeApartment.title}
            </p>

            <div className="mt-8 grid gap-6 text-sm leading-7 text-black/66 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <ApartmentFact label="Bauteil" value={activeApartment.section} />
              <ApartmentFact
                label="Position"
                value={activeApartment.position}
              />
              <ApartmentFact
                label="Fläche"
                value={`${activeApartment.sqm.toLocaleString("de-DE")} m²`}
              />
              <ApartmentFact label="Etage" value={activeApartment.floorLabel} />
              <ApartmentFact label="Zimmer" value={activeApartment.rooms} />
              <ApartmentFact label="Bäder" value={activeApartment.bathrooms} />
              <ApartmentFact
                label="Balkon/Garten"
                value={getOutdoorSpaceLabel(activeApartment)}
              />
              <ApartmentFact
                label="Kaltmiete"
                value={formatColdRent(activeApartment)}
              />
              <ApartmentFact
                label="Verfügbarkeit"
                value={
                  <span
                    className={`inline-flex border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] ${
                      activeApartment.availability === "Vermietet"
                        ? "border-[#FF3B30]/32 bg-[#FF3B30]/10 text-[#FF3B30]"
                        : "border-[var(--accent)]/18 bg-white/58 text-[var(--accent)]"
                    }`}
                  >
                    {activeApartment.availability}
                  </span>
                }
              />
            </div>

            <p className="mt-6 text-sm leading-7 text-black/64">
              Auswahl und Hervorhebung bleiben im vollständigen Grundriss,
              damit Fenster, Räume, Wände und Wohnungsgrenzen zusammen lesbar
              bleiben.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)]/62">
              Wohnung wählen
            </p>
            <h3 className="mt-4 font-serif text-4xl leading-none text-[var(--accent)] sm:text-5xl">
              Grundriss
            </h3>
            <p className="mt-3 text-lg leading-7 text-black/72 sm:text-xl sm:leading-8">
              Wähle eine Einheit im Grundriss oder über die Liste, um Fläche,
              Lage und Anfrageoption zu sehen.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8">
        <button
          type="button"
          onClick={onInquiry}
          disabled={inquiryDisabled}
          className={`w-full px-6 py-4 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-white transition-colors duration-300 ${
            activeApartment?.availability === "Vermietet"
              ? "cursor-not-allowed bg-[#FF3B30]"
              : "bg-[var(--accent)] hover:bg-black disabled:cursor-not-allowed disabled:bg-[var(--accent)]/34"
          }`}
        >
          {activeApartment?.availability === "Vermietet"
            ? "Vermietet"
            : "Anfragen"}
        </button>
      </div>

      <div className="mt-9 border-t border-[var(--accent)]/12 pt-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)]/58">
          Wohnung wählen
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {floor.apartments.map((apartment) => {
            const active = apartment.id === activeApartment?.id;
            const preview = apartment.id === previewApartmentId && !active;
            const sold = apartment.availability === "Vermietet";

            return (
              <motion.button
                key={apartment.id}
                type="button"
                onFocus={() => onPreview(apartment.id)}
                onBlur={onPreviewEnd}
                onPointerEnter={() => onPreview(apartment.id)}
                onPointerMove={() => onPreview(apartment.id)}
                onPointerLeave={onPreviewEnd}
                onMouseEnter={() => onPreview(apartment.id)}
                onMouseMove={() => onPreview(apartment.id)}
                onMouseLeave={onPreviewEnd}
                onClick={() => onSelect(apartment.id)}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                className={`min-h-[72px] border px-4 py-3 text-left transition-colors duration-300 ${
                  sold && active
                    ? "border-[#FF3B30] bg-[#FF3B30]/8 text-[#FF3B30]"
                    : sold && preview
                      ? "border-[#FF3B30]/58 bg-white text-[#FF3B30] shadow-[0_12px_30px_rgba(255,59,48,0.08)]"
                    : sold
                      ? "border-[#FF3B30]/18 bg-white/42 text-black/62 hover:border-[#FF3B30]/48 hover:bg-white"
                    : active
                    ? "border-[var(--accent)] bg-[#f7f3eb] text-[var(--accent)]"
                    : preview
                      ? "border-[var(--accent)]/58 bg-white text-[var(--accent)] shadow-[0_12px_30px_rgba(75,73,45,0.08)]"
                    : "border-[var(--accent)]/12 bg-white/42 text-black/62 hover:border-[var(--accent)]/34 hover:bg-white"
                }`}
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="font-serif text-2xl leading-none">
                    {apartment.code}
                  </span>
                  {sold ? (
                    <span className="border border-[#FF3B30]/28 bg-[#FF3B30]/10 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-[#FF3B30]">
                      Vermietet
                    </span>
                  ) : null}
                </span>
                <span className="mt-2 block text-xs leading-5 text-black/54">
                  {apartment.sqm.toLocaleString("de-DE")} m²
                  {" · "}
                  {formatColdRent(apartment)}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

export function ApartmentsExplorer() {
  const [selectedFloorId, setSelectedFloorId] = useState(apartmentFloors[0].id);
  const [selectedApartmentId, setSelectedApartmentId] = useState<string | null>(
    null,
  );
  const [previewApartmentId, setPreviewApartmentId] = useState<string | null>(
    null,
  );
  const [inquiryOpen, setInquiryOpen] = useState(false);

  const selectedFloor =
    apartmentFloors.find((floor) => floor.id === selectedFloorId) ??
    apartmentFloors[0];

  const activeApartment =
    selectedFloor.apartments.find(
      (apartment) => apartment.id === selectedApartmentId,
    ) ?? null;

  const hoverApartment =
    selectedFloor.apartments.find(
      (apartment) => apartment.id === previewApartmentId,
    ) ?? null;
  const displayedApartment = hoverApartment ?? activeApartment;

  const selectFloor = (floorId: string) => {
    setSelectedFloorId(floorId);
    setSelectedApartmentId(null);
    setPreviewApartmentId(null);
  };

  const selectApartment = (apartmentId: string) => {
    setSelectedApartmentId(apartmentId);
    setPreviewApartmentId(null);
  };

  return (
    <LayoutGroup>
      <section className="border-t border-[var(--accent)]/14 bg-[#f7f3eb] px-6 py-16 sm:px-8 lg:px-10 lg:py-24">
        <div className="mx-auto w-full max-w-7xl">
          <div className="-mx-1 flex flex-wrap items-end gap-2 overflow-x-auto px-1 pb-1 sm:mx-0 sm:gap-3 sm:overflow-visible sm:px-0 sm:pb-0">
            {apartmentFloors.map((floor) => {
              const active = selectedFloorId === floor.id;

              return (
                <button
                  key={floor.id}
                  type="button"
                  onClick={() => selectFloor(floor.id)}
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
                    {floor.apartments.length} WE
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-8">
            <p className="max-w-3xl text-sm leading-6 text-black/54 sm:leading-7">
              Wähle ein Geschoss und klicke eine Wohneinheit an. Die
              Wohnungsgrenzen werden direkt im vollständigen Grundriss
              hervorgehoben.
            </p>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.18fr)_minmax(330px,0.82fr)] lg:items-start">
            <div>
              <CadPlanSurface
                floor={selectedFloor}
                activeApartment={activeApartment}
                hoverApartment={hoverApartment}
                onSelect={selectApartment}
                onPreview={setPreviewApartmentId}
                onPreviewEnd={() => setPreviewApartmentId(null)}
              />

              <p className="mt-4 max-w-2xl text-xs leading-6 text-black/46">
                Die Übersicht zeigt die Wohnungen im Zusammenhang des gesamten
                Geschosses, damit Lage, Erschließung und Außenbereiche schnell
                erfassbar bleiben.
              </p>
            </div>

            <ApartmentDetailsPanel
              floor={selectedFloor}
              activeApartment={displayedApartment}
              previewApartmentId={previewApartmentId}
              onSelect={selectApartment}
              onPreview={setPreviewApartmentId}
              onPreviewEnd={() => setPreviewApartmentId(null)}
              onInquiry={() => setInquiryOpen(true)}
            />
          </div>
        </div>

        <ApartmentInquiryDialog
          open={inquiryOpen}
          onOpenChange={setInquiryOpen}
          apartmentCode={displayedApartment?.code}
          apartmentTitle={displayedApartment?.title}
          floorLabel={displayedApartment?.floorLabel}
        />
      </section>
    </LayoutGroup>
  );
}
