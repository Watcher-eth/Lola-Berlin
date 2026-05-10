import { ApartmentInquiryForm } from "@/components/ApartmentInquiryForm";

type ApartmentInquirySectionProps = {
  showSecondaryCta?: boolean;
  backgroundClassName?: string;
};

export function ApartmentInquirySection({
  showSecondaryCta = true,
  backgroundClassName = "bg-[#dfe7df]",
}: ApartmentInquirySectionProps) {
  return (
    <section
      className={`border-t border-[var(--accent)]/14 px-6 py-20 sm:px-8 lg:px-10 lg:py-28 ${backgroundClassName}`}
    >
      <div className="mx-auto w-full max-w-5xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--accent)]/62">
            Anfrage
          </p>
          <h2 className="mt-5 font-serif text-3xl leading-none tracking-[-0.05em] text-[var(--accent)] sm:text-5xl lg:text-[4rem]">
            Interesse an Lola?
          </h2>
          <p className="mt-5 text-sm leading-7 text-black/64 sm:text-base sm:leading-8 md:text-lg">
            Hinterlasse deine Kontaktdaten, wenn du mehr über Verfügbarkeit,
            Grundrisse und die passenden Wohnungstypen erfahren möchtest.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-4xl">
          <ApartmentInquiryForm submitLabel="Kontakt aufnehmen" />
        </div>

        {showSecondaryCta ? (
          <div className="mt-20 text-center">
            <h3 className="font-serif text-4xl leading-none tracking-[-0.05em] text-[var(--accent)] sm:text-6xl">
              Mehr von Lola sehen
            </h3>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-black/62 sm:text-base sm:leading-8">
              Auf Anfrage teilen wir weitere Grundrisse, Details zur Ausstattung
              und den aktuellen Stand der verfügbaren Wohnungen.
            </p>
            <div className="mt-8">
              <a
                href="mailto:hello@lola.berlin"
                className="flex w-full justify-center bg-[var(--accent)] px-7 py-4 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:bg-black"
              >
                Kontakt aufnehmen
              </a>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
