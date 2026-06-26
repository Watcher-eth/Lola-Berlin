import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";

export function LandingApartmentsSection() {
  return (
    <section
      id="apartments"
      className="relative isolate border-t border-white/30"
    >
      <div className="bg-white/70 px-6 py-16 backdrop-blur-xl sm:px-8 lg:px-10 lg:py-24">
        <div className="mx-auto w-full max-w-6xl">
          <Reveal>
            <div>
              <div className="mb-8 border-t border-[var(--accent)]/24 pt-4 lg:mb-10">
                <p className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--accent)]/72">
                  Wohnungen
                </p>
                <h2 className="mt-3 max-w-md font-serif text-3xl leading-none tracking-[-0.05em] text-balance text-[var(--accent)] sm:text-5xl">
                  Wohnräume mit Stil.
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-7 text-black/68 sm:text-base sm:leading-8">
                  LOLA verbindet großzügige Grundrisse und hochwertige
                  Materialien mit der wunderschönen Architektur der Gründerzeit.
                  Die Wohnungen mit 1 bis 5 Zimmern sind weit und groß und
                  vermitteln zugleich dauerhaft Geborgenheit.
                </p>
              </div>

              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)]">
                <div className="relative aspect-[1.68/1] overflow-hidden bg-[var(--accent-soft)]">
                  <Image
                    src="/rooms/Wohnzimmer1.JPG"
                    alt="Wohnraum in Lola"
                    fill
                    priority={false}
                    sizes="(min-width: 1024px) 62vw, 100vw"
                    className="object-cover object-center"
                  />
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal className="mt-14 lg:mt-16" delay={0.08}>
            <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
              <div>
                <div className="relative aspect-[0.85/1] overflow-hidden bg-[var(--accent-soft)]">
                  <Image
                    src="/rooms/Bedroom2.png"
                    alt="Schlafzimmer in Lola"
                    fill
                    sizes="(min-width: 1024px) 28vw, 100vw"
                    className="object-cover object-center"
                  />
                </div>
                <p className="mt-5 max-w-md text-sm leading-7 text-black/62">
                  Helle Wohnungen, Fußbodenheizung, hohe Decken und ein grüner
                  Innenhof bieten hohen Wohnkomfort in einem der schönsten Kieze
                  Berlins.
                </p>
              </div>

              <div>
                <div className="relative aspect-[1.02/1] overflow-hidden bg-[var(--accent-soft)]">
                  <Image
                    src="/rooms/Wohnzimmer3.png"
                    alt="Wohnzimmer in Lola"
                    fill
                    sizes="(min-width: 1024px) 46vw, 100vw"
                    className="object-cover object-center"
                  />
                </div>
                <div className="mt-6 flex flex-col items-start gap-5 sm:gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <p className="max-w-xl text-sm leading-7 text-black/68 sm:text-base sm:leading-8">
                    LOLA bringt Grundrisse für jedes Bedürfnis, wertige
                    Materialien und ein modernes, urbanes Wohngefühl zusammen.
                    Die Wohnungen orientieren sich an den alten
                    großbürgerlichen Grundrissen und wirken selbstverständlich
                    statt inszeniert: ästhetisch wohnen mit Platz, Raum, Ruhe
                    und Halt.
                  </p>
                  <Link
                    href="/apartments"
                    className="w-full rounded-full border border-[var(--accent)]/18 px-6 py-3 text-center font-mono text-xs uppercase tracking-[0.22em] text-[var(--accent)] transition-all duration-500 hover:bg-[var(--accent)] hover:text-[#f7f3eb] sm:w-auto lg:shrink-0"
                  >
                    Alle Wohnungen
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="bg-[#f7f3eb] px-6 py-16 sm:px-8 lg:px-10 lg:py-24">
        <div className="mx-auto w-full max-w-6xl">
        <Reveal className="mt-16 border-t border-[var(--accent)]/24 pt-12 lg:mt-20 lg:pt-16" delay={0.12}>
          <div className="mb-8 lg:mb-10">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--accent)]/72">
              Haus
            </p>
            <h3 className="mt-3 max-w-lg font-serif text-3xl leading-none tracking-[-0.05em] text-balance text-[var(--accent)] sm:text-5xl">
              Altbaucharme, neu gedacht.
            </h3>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-black/68 sm:text-base sm:leading-8">
              LOLA hält die Substanz eines Berliner Gründerzeithauses und
              übersetzt sie in einen zeitgemäßen Wohnalltag. Vom Treppenhaus
              bis zu den ruhigen Gartenbezügen entsteht ein Haus, das
              Geschichte, Komfort und neue technische Qualität selbstverständlich
              zusammenbringt.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start lg:gap-10">
            <div>
              <div className="relative aspect-[1.34/1] overflow-hidden bg-[var(--accent-soft)]">
                <Image
                  src="/balcon.png"
                  alt="Außenbereich mit Blick zum Garten in Lola"
                  fill
                  sizes="(min-width: 1024px) 48vw, 100vw"
                  className="object-cover object-center"
                />
              </div>
              <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.18em] text-black/42">
                Nur Hinterhaus zum Garten.
              </p>
            </div>

            <div className="lg:pt-12">
              <div className="relative aspect-[0.86/1] overflow-hidden bg-[var(--accent-soft)]">
                <Image
                  src="/Stair.png"
                  alt="Treppenhaus in Lola"
                  fill
                  sizes="(min-width: 1024px) 34vw, 100vw"
                  className="object-cover object-center"
                />
              </div>
              <p className="mt-5 max-w-md text-sm leading-7 text-black/62">
                Sorgfältig erneuerte Details, klare Wege und die ruhige
                Materialität des Hauses lassen schon beim Eintreten spüren,
                wie sorgfältig LOLA gestaltet ist.
              </p>
            </div>
          </div>
        </Reveal>
        </div>
      </div>
    </section>
  );
}
