import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { ApartmentInquiryDialog } from "@/components/ApartmentInquiryDialog";
import {
  apartmentFloors,
  ApartmentUnit,
  FloorPlanData,
} from "@/data/apartments";

type PlanMode = "floor" | "apartment";

type PlanFocus = {
  x: number;
  y: number;
  scale: number;
};

const planTransition = {
  type: "spring",
  stiffness: 82,
  damping: 20,
  mass: 0.9,
} as const;

const focusTransition = {
  type: "spring",
  stiffness: 140,
  damping: 21,
  mass: 0.78,
} as const;

const planFocus: Record<string, PlanFocus> = {
  "WE 04": { x: 35, y: 18, scale: 3.6 },
  "WE 03.2": { x: 42, y: 31, scale: 3.4 },
  "WE 03.1": { x: 65, y: 18, scale: 3.6 },
  "WE 22": { x: 28, y: 45, scale: 3.9 },
  "WE 23": { x: 39, y: 77, scale: 3.5 },
  "WE 24": { x: 72, y: 45, scale: 3.9 },
  "WE 25": { x: 61, y: 77, scale: 3.7 },
  "WE 05": { x: 72, y: 56, scale: 3.9 },
  "WE 08": { x: 35, y: 18, scale: 3.6 },
  "WE 07": { x: 65, y: 18, scale: 3.6 },
  "WE 06": { x: 28, y: 43, scale: 4 },
  "WE 26": { x: 34, y: 55, scale: 4 },
  "WE 27": { x: 40, y: 77, scale: 3.5 },
  "WE 28": { x: 62, y: 77, scale: 3.5 },
  "WE 09": { x: 72, y: 43, scale: 4 },
  "WE 29": { x: 68, y: 55, scale: 4 },
  "WE 12/13": { x: 58, y: 32, scale: 2.9 },
  "WE 10/11": { x: 42, y: 32, scale: 2.9 },
  "WE 30": { x: 42, y: 72, scale: 3.1 },
  "WE 31/32": { x: 62, y: 72, scale: 3.1 },
  "WE 14/15": { x: 42, y: 32, scale: 2.9 },
  "WE 16/17": { x: 58, y: 32, scale: 2.9 },
  "WE 33/34": { x: 42, y: 72, scale: 3.1 },
  "WE 35/36": { x: 62, y: 72, scale: 3.1 },
};

function getFocus(apartment: ApartmentUnit): PlanFocus {
  return planFocus[apartment.code] ?? { x: 50, y: 50, scale: 3.2 };
}

function PlanImage({
  apartment,
  priority = false,
}: {
  apartment: ApartmentUnit;
  priority?: boolean;
}) {
  return (
    <Image
      src={apartment.cadPlanSrc}
      alt={`Grundriss ${apartment.code}`}
      fill
      unoptimized
      priority={priority}
      sizes="(min-width: 1024px) 70vw, 94vw"
      className="object-contain p-4 contrast-[1.14] sm:p-8"
    />
  );
}

function ApartmentFact({
  label,
  value,
}: {
  label: string;
  value: string | number;
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

function getOutdoorSpaceLabel(apartment: ApartmentUnit) {
  if (apartment.gardenAccess) return "Gartenzugang";
  if (apartment.balcony) return "Balkon";
  return "Auf Anfrage";
}

function CadPlanSurface({
  floor,
  activeApartment,
  mode,
  onZoom,
  onBack,
}: {
  floor: FloorPlanData;
  activeApartment: ApartmentUnit;
  mode: PlanMode;
  onZoom: () => void;
  onBack: () => void;
}) {
  const focus = getFocus(activeApartment);
  const detailMode = mode === "apartment";

  return (
    <motion.div
      layout
      transition={planTransition}
      className="overflow-hidden border border-[var(--accent)]/12 bg-[#f8f6ef] shadow-[0_24px_70px_rgba(75,73,45,0.1)]"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{ transformOrigin: `${focus.x}% ${focus.y}%` }}
          animate={{
            scale: detailMode ? focus.scale : 1,
            opacity: detailMode ? 0.18 : 1,
            filter: detailMode ? "blur(1px)" : "blur(0px)",
          }}
          transition={planTransition}
        >
          <Image
            src={floor.cadFloorSrc}
            alt={`Grundriss ${floor.floorLabel}`}
            fill
            unoptimized
            priority
            sizes="(min-width: 1024px) 70vw, 94vw"
            className="object-contain p-4 contrast-[1.2] sm:p-7"
          />
        </motion.div>

        {!detailMode ? (
          <>
            <motion.div
              key={`${activeApartment.id}-label`}
              className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-1/2 bg-[#f8f6ef]/88 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--accent)] shadow-[0_10px_24px_rgba(75,73,45,0.12)] backdrop-blur-sm"
              style={{
                left: `${focus.x}%`,
                top: `${focus.y}%`,
              }}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={focusTransition}
            >
              {activeApartment.code}
            </motion.div>
            <button
              type="button"
              onClick={onZoom}
              className="absolute inset-0 z-10 cursor-zoom-in outline-none"
              aria-label={`In ${activeApartment.code} zoomen`}
            />
          </>
        ) : null}

        <AnimatePresence>
          {detailMode ? (
            <motion.div
              key={activeApartment.id}
              className="absolute inset-0 z-30 bg-white"
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.985 }}
              transition={{ duration: 0.44, ease: [0.22, 1, 0.36, 1] }}
            >
              <PlanImage apartment={activeApartment} priority />
              <button
                type="button"
                onClick={onBack}
                className="absolute left-4 top-4 border border-[var(--accent)]/24 bg-[#f8f6ef]/86 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--accent)] backdrop-blur-sm transition-colors duration-300 hover:border-[var(--accent)]/50 hover:bg-white sm:left-5 sm:top-5"
              >
                Geschossplan
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-[var(--accent)]/12 bg-white/58 px-4 py-3 text-[10px] uppercase tracking-[0.16em] text-[var(--accent)]/64">
        <span className="inline-flex items-center gap-2">
          <span className="h-px w-8 bg-[var(--accent)]" />
          WE-Vorschau
        </span>
      </div>
    </motion.div>
  );
}

function ApartmentDetailsPanel({
  floor,
  activeApartment,
  mode,
  previewApartmentId,
  onSelect,
  onPreview,
  onPreviewEnd,
  onZoom,
  onBack,
  onInquiry,
}: {
  floor: FloorPlanData;
  activeApartment: ApartmentUnit;
  mode: PlanMode;
  previewApartmentId: string | null;
  onSelect: (apartmentId: string) => void;
  onPreview: (apartmentId: string) => void;
  onPreviewEnd: () => void;
  onZoom: () => void;
  onBack: () => void;
  onInquiry: () => void;
}) {
  const detailMode = mode === "apartment";

  return (
    <aside className="border border-[var(--accent)]/14 bg-white/54 p-5 sm:p-6">
      <AnimatePresence mode="wait">
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
            <ApartmentFact label="Position" value={activeApartment.position} />
            <ApartmentFact
              label="Fläche"
              value={`${activeApartment.sqm.toLocaleString("de-DE")} m²`}
            />
            <ApartmentFact label="Etage" value={activeApartment.floorLabel} />
            <ApartmentFact label="Zimmer" value={activeApartment.rooms} />
            <ApartmentFact label="Bäder" value={activeApartment.bathrooms} />
            <ApartmentFact
              label="Außenraum"
              value={getOutdoorSpaceLabel(activeApartment)}
            />
            <ApartmentFact
              label="Status"
              value={activeApartment.availability}
            />
          </div>

          <p className="mt-6 text-sm leading-7 text-black/64">
            Unmöbliert, mit fest eingebauter Küche und hochwertig
            ausgeführtem Bad. Weitere Informationen zur Wohnung teilen wir auf
            Anfrage.
          </p>
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <button
          type="button"
          onClick={detailMode ? onBack : onZoom}
          className="border border-[var(--accent)]/22 bg-white/64 px-6 py-4 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent)] transition-colors duration-300 hover:border-[var(--accent)]/48 hover:bg-white"
        >
          {detailMode ? "Geschossplan" : "Grundriss öffnen"}
        </button>
        <button
          type="button"
          onClick={onInquiry}
          className="bg-[var(--accent)] px-6 py-4 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:bg-black"
        >
          Anfragen
        </button>
      </div>

      <div className="mt-9 border-t border-[var(--accent)]/12 pt-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)]/58">
          Wohnung wählen
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {floor.apartments.map((apartment) => {
            const active = apartment.id === activeApartment.id;
            const preview = apartment.id === previewApartmentId && !active;

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
                className={`min-h-[76px] border px-4 py-3 text-left transition-colors duration-300 ${
                  active
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
                </span>
                <span className="mt-2 block text-xs leading-5 text-black/54">
                  {apartment.sqm.toLocaleString("de-DE")} m²
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
  const [selectedApartmentId, setSelectedApartmentId] = useState(
    apartmentFloors[0].apartments[0]?.id ?? "",
  );
  const [previewApartmentId, setPreviewApartmentId] = useState<string | null>(
    null,
  );
  const [planMode, setPlanMode] = useState<PlanMode>("floor");
  const [inquiryOpen, setInquiryOpen] = useState(false);

  const selectedFloor =
    apartmentFloors.find((floor) => floor.id === selectedFloorId) ??
    apartmentFloors[0];

  const activeApartment =
    selectedFloor.apartments.find(
      (apartment) => apartment.id === selectedApartmentId,
    ) ?? selectedFloor.apartments[0];

  const previewApartment =
    planMode === "floor"
      ? selectedFloor.apartments.find(
          (apartment) => apartment.id === previewApartmentId,
        ) ?? activeApartment
      : activeApartment;

  const selectFloor = (floorId: string) => {
    const floor = apartmentFloors.find((item) => item.id === floorId);
    setSelectedFloorId(floorId);
    setSelectedApartmentId(floor?.apartments[0]?.id ?? "");
    setPreviewApartmentId(null);
    setPlanMode("floor");
  };

  const selectApartment = (apartmentId: string) => {
    setSelectedApartmentId(apartmentId);
    setPreviewApartmentId(null);
  };

  const openPreviewApartment = () => {
    setSelectedApartmentId(previewApartment.id);
    setPreviewApartmentId(null);
    setPlanMode("apartment");
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
              Wähle ein Geschoss und eine Wohnung. Beim Öffnen zoomt derselbe
              Plan in den zugeordneten Grundrissausschnitt.
            </p>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.18fr)_minmax(330px,0.82fr)] lg:items-start">
            <div>
              <CadPlanSurface
                floor={selectedFloor}
                activeApartment={previewApartment}
                mode={planMode}
                onZoom={openPreviewApartment}
                onBack={() => setPlanMode("floor")}
              />

              <p className="mt-4 max-w-2xl text-xs leading-6 text-black/46">
                Die WE-Auswahl reagiert direkt beim Überfahren. Ein Klick auf
                die Planfläche öffnet den vergrößerten Ausschnitt ohne separates
                Dialogfenster.
              </p>
            </div>

            <ApartmentDetailsPanel
              floor={selectedFloor}
              activeApartment={activeApartment}
              mode={planMode}
              previewApartmentId={previewApartmentId}
              onSelect={selectApartment}
              onPreview={setPreviewApartmentId}
              onPreviewEnd={() => setPreviewApartmentId(null)}
              onZoom={() => setPlanMode("apartment")}
              onBack={() => setPlanMode("floor")}
              onInquiry={() => setInquiryOpen(true)}
            />
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
    </LayoutGroup>
  );
}
