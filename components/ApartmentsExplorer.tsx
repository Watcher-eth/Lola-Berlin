import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { ApartmentInquiryDialog } from "@/components/ApartmentInquiryDialog";
import { apartmentFloors, ApartmentUnit } from "@/data/apartments";

const euroFormatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const planTransition = {
  type: "spring",
  stiffness: 118,
  damping: 22,
  mass: 0.92,
} as const;

function PlanImage({
  apartment,
  priority = false,
}: {
  apartment: ApartmentUnit;
  priority?: boolean;
}) {
  return (
    <Image
      src={apartment.planImageSrc}
      alt={`Grundriss ${apartment.code}`}
      fill
      priority={priority}
      sizes="(min-width: 1024px) 36vw, 92vw"
      className="object-contain"
    />
  );
}

function FloorPlanRegion({
  apartment,
  active,
  onPreview,
  onZoom,
}: {
  apartment: ApartmentUnit;
  active: boolean;
  onPreview: () => void;
  onZoom: () => void;
}) {
  return (
    <motion.button
      type="button"
      aria-label={`${apartment.code} öffnen`}
      onMouseEnter={onPreview}
      onFocus={onPreview}
      onClick={onZoom}
      className={`absolute border text-left outline-none transition-colors duration-300 ${
        active
          ? "border-[var(--accent)] bg-[var(--accent)]/18"
          : "border-[var(--accent)]/42 bg-[#f7f3eb]/34 hover:bg-[var(--accent)]/12 focus-visible:bg-[var(--accent)]/12"
      }`}
      style={{
        left: `${apartment.bounds.x}%`,
        top: `${apartment.bounds.y}%`,
        width: `${apartment.bounds.width}%`,
        height: `${apartment.bounds.height}%`,
      }}
      whileHover={{ scale: 1.018 }}
      whileTap={{ scale: 0.992 }}
      transition={planTransition}
    >
      {active ? (
        <motion.span
          layoutId={`plan-shell-${apartment.id}`}
          className="absolute inset-0 bg-white/28 shadow-[0_24px_70px_rgba(75,73,45,0.22)]"
          transition={planTransition}
        />
      ) : null}
      <span className="absolute left-2 top-2 bg-white/86 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--accent)] shadow-[0_8px_22px_rgba(0,0,0,0.08)] sm:left-3 sm:top-3 sm:text-[10px]">
        {apartment.code}
      </span>
    </motion.button>
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

export function ApartmentsExplorer() {
  const [selectedFloorId, setSelectedFloorId] = useState(apartmentFloors[0].id);
  const [selectedApartmentId, setSelectedApartmentId] = useState(
    apartmentFloors[0].apartments[0]?.id ?? "",
  );
  const [zoomedApartmentId, setZoomedApartmentId] = useState<string | null>(
    null,
  );
  const [modalTop, setModalTop] = useState(0);
  const [inquiryOpen, setInquiryOpen] = useState(false);

  const selectedFloor =
    apartmentFloors.find((floor) => floor.id === selectedFloorId) ??
    apartmentFloors[0];

  const activeApartment =
    selectedFloor.apartments.find(
      (apartment) => apartment.id === selectedApartmentId,
    ) ?? selectedFloor.apartments[0];

  const zoomedApartment =
    selectedFloor.apartments.find(
      (apartment) => apartment.id === zoomedApartmentId,
    ) ?? null;

  const selectFloor = (floorId: string) => {
    const floor = apartmentFloors.find((item) => item.id === floorId);
    setSelectedFloorId(floorId);
    setSelectedApartmentId(floor?.apartments[0]?.id ?? "");
    setZoomedApartmentId(null);
  };

  const openApartmentPlan = (apartmentId: string) => {
    setModalTop(window.scrollY);
    setSelectedApartmentId(apartmentId);
    setZoomedApartmentId(apartmentId);
  };

  useEffect(() => {
    if (!zoomedApartmentId) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setZoomedApartmentId(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [zoomedApartmentId]);

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
                    {floor.apartments.length} Pläne
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,0.72fr)_minmax(280px,0.28fr)] lg:items-end">
            <p className="max-w-3xl text-sm leading-6 text-black/54 sm:leading-7">
              {selectedFloor.note}
            </p>
            <p className="text-sm leading-6 text-black/54 sm:leading-7">
              {selectedFloor.modelNote}
            </p>
          </div>

          <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1.12fr)_minmax(320px,0.88fr)] lg:items-start">
            <div>
              <div className="relative aspect-[1170/855] overflow-hidden bg-[#f1eadf]">
                <Image
                  src={selectedFloor.planImageSrc}
                  alt={`Geschossübersicht ${selectedFloor.floorLabel}`}
                  fill
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-contain"
                  priority
                />

                {selectedFloor.apartments.map((apartment) => (
                  <FloorPlanRegion
                    key={apartment.id}
                    apartment={apartment}
                    active={activeApartment?.id === apartment.id}
                    onPreview={() => setSelectedApartmentId(apartment.id)}
                    onZoom={() => openApartmentPlan(apartment.id)}
                  />
                ))}
              </div>

              <p className="mt-4 max-w-2xl text-xs leading-6 text-black/46">
                Die markierten Bereiche verorten die vorhandenen Einzelpläne als
                Typologien innerhalb des Geschosses. Ein Klick öffnet den
                zugehörigen Wohnungsgrundriss.
              </p>
            </div>

            <div>
              <motion.div
                layout
                className="relative aspect-[1271/1800] overflow-hidden bg-white shadow-[0_24px_70px_rgba(75,73,45,0.13)]"
                transition={planTransition}
              >
                <PlanImage apartment={activeApartment} priority />
              </motion.div>

              <div className="mt-8">
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
                  <ApartmentFact
                    label="Bauteil"
                    value={activeApartment.section}
                  />
                  <ApartmentFact
                    label="Position"
                    value={activeApartment.position}
                  />
                  <ApartmentFact
                    label="Fläche"
                    value={`${activeApartment.sqm.toLocaleString("de-DE")} m²`}
                  />
                  <ApartmentFact
                    label="Miete/m²"
                    value={`${activeApartment.rentPerSqm} €/m²`}
                  />
                  <ApartmentFact
                    label="Etage"
                    value={activeApartment.floorLabel}
                  />
                  <ApartmentFact
                    label="Zimmer"
                    value={activeApartment.rooms}
                  />
                  <ApartmentFact
                    label="Bäder"
                    value={activeApartment.bathrooms}
                  />
                  <ApartmentFact
                    label="Außenraum"
                    value={
                      activeApartment.gardenAccess
                        ? "Gartenzugang"
                        : activeApartment.balcony
                          ? "Balkon"
                          : "Kein Außenraum"
                    }
                  />
                  <ApartmentFact
                    label="Status"
                    value={activeApartment.availability}
                  />
                </div>

                <p className="mt-8 text-2xl leading-none text-[var(--accent)] sm:text-3xl">
                  ca. {euroFormatter.format(activeApartment.price)} / Monat
                </p>
                <p className="mt-3 text-sm leading-6 text-black/50">
                  Berechnet aus{" "}
                  {activeApartment.sqm.toLocaleString("de-DE")} m² x{" "}
                  {activeApartment.rentPerSqm} €/m².
                </p>

                <p className="mt-6 max-w-xl text-sm leading-7 text-black/64 sm:text-base sm:leading-8">
                  {activeApartment.note}
                </p>

                <p className="mt-4 max-w-xl text-sm leading-7 text-black/54">
                  Modell: {activeApartment.modelLabel}
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => openApartmentPlan(activeApartment.id)}
                    className="border border-[var(--accent)]/22 bg-white/64 px-7 py-4 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent)] transition-colors duration-300 hover:border-[var(--accent)]/48 hover:bg-white"
                  >
                    Grundriss öffnen
                  </button>
                  <button
                    type="button"
                    onClick={() => setInquiryOpen(true)}
                    className="bg-[var(--accent)] px-7 py-4 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:bg-black"
                  >
                    Anfragen
                  </button>
                </div>
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

      <AnimatePresence>
        {zoomedApartment ? (
          <motion.div
            className="z-50 grid place-items-start overflow-y-auto bg-[#171611]/68 px-4 py-6 backdrop-blur-sm sm:px-8"
            style={{
              position: "fixed",
              left: 0,
              top: modalTop,
              width: "100vw",
              height: "100dvh",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => setZoomedApartmentId(null)}
          >
            <motion.div
              className="my-auto grid w-full max-w-6xl justify-self-center overflow-hidden bg-[#f7f3eb] shadow-[0_30px_100px_rgba(0,0,0,0.28)] lg:max-h-[92vh] lg:grid-cols-[minmax(0,0.72fr)_minmax(280px,0.28fr)]"
              onClick={(event) => event.stopPropagation()}
              initial={{ y: 18 }}
              animate={{ y: 0 }}
              exit={{ y: 18 }}
              transition={planTransition}
            >
              <motion.div
                layoutId={`plan-shell-${zoomedApartment.id}`}
                className="relative min-h-[62vh] bg-white lg:min-h-[86vh]"
                transition={planTransition}
              >
                <PlanImage apartment={zoomedApartment} priority />
              </motion.div>

              <div className="flex flex-col justify-between gap-8 p-6 sm:p-8">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)]/62">
                    Grundriss
                  </p>
                  <h3 className="mt-4 font-serif text-4xl leading-none tracking-[-0.05em] text-[var(--accent)]">
                    {zoomedApartment.code}
                  </h3>
                  <p className="mt-4 text-base leading-7 text-black/68">
                    {zoomedApartment.title}
                  </p>
                  <p className="mt-6 text-sm leading-7 text-black/58">
                    {zoomedApartment.modelLabel}.{" "}
                    {zoomedApartment.sqm.toLocaleString("de-DE")} m²,{" "}
                    {zoomedApartment.rooms} Zimmer. Ca.{" "}
                    {euroFormatter.format(zoomedApartment.price)} / Monat bei{" "}
                    {zoomedApartment.rentPerSqm} €/m².
                  </p>
                </div>

                <div className="grid gap-3">
                  <a
                    href={zoomedApartment.sourcePdfSrc}
                    target="_blank"
                    rel="noreferrer"
                    className="border border-[var(--accent)]/22 bg-white/64 px-5 py-4 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--accent)] transition-colors duration-300 hover:border-[var(--accent)]/48 hover:bg-white"
                  >
                    PDF ansehen
                  </a>
                  <button
                    type="button"
                    onClick={() => setZoomedApartmentId(null)}
                    className="bg-[var(--accent)] px-5 py-4 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:bg-black"
                  >
                    Schließen
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </LayoutGroup>
  );
}
