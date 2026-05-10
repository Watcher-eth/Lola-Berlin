import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";

export function LandingApartmentsSection() {
  return (
    <section
      id="apartments"
      className="border-t border-[var(--accent)]/14 bg-[#f7f3eb] px-6 py-16 sm:px-8 lg:px-10 lg:py-24"
    >
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <div>
            <div className="mb-8 border-t border-[var(--accent)]/24 pt-4 lg:mb-10">
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--accent)]/72">
                Wohnungen
              </p>
              <h2 className="mt-3 max-w-md font-serif text-3xl leading-none tracking-[-0.05em] text-balance text-[var(--accent)] sm:text-5xl">
                Wohnräume mit Haltung.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-black/68 sm:text-base sm:leading-8">
                Lola verbindet großzügige Grundrisse, ruhige Materialien und
                ein präzises architektonisches Gefühl zu Wohnungen, die offen
                wirken und zugleich dauerhaft Geborgenheit vermitteln.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)]">
              <div className="relative aspect-[1.68/1] overflow-hidden bg-[var(--accent-soft)]">
                <Image
                  src="/rooms/kitchen2.png"
                  alt="Küche in Lola"
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
                  src="/rooms/Wohnzimmer3.png"
                  alt="Wohnzimmer in Lola"
                  fill
                  sizes="(min-width: 1024px) 28vw, 100vw"
                  className="object-cover object-center"
                />
              </div>
              <p className="mt-5 max-w-md text-sm leading-7 text-black/62">
                Helle Wohnungen, grüne Höfe und eine klare Adresse formen ein
                Zuhause, das Offenheit und Rückzug selbstverständlich
                miteinander verbindet.
              </p>
            </div>

            <div>
              <div className="relative aspect-[1.02/1] overflow-hidden bg-[var(--accent-soft)]">
                <Image
                  src="/rooms/Bedroom2.png"
                  alt="Schlafzimmer in Lola"
                  fill
                  sizes="(min-width: 1024px) 46vw, 100vw"
                  className="object-cover object-center"
                />
              </div>
              <div className="mt-6 flex flex-col items-start gap-5 sm:gap-6 lg:flex-row lg:items-start lg:justify-between">
                <p className="max-w-xl text-sm leading-7 text-black/68 sm:text-base sm:leading-8">
                  Lola bringt großzügige Grundrisse, ruhige Materialien und ein
                  präzises architektonisches Gefühl zusammen. Die Wohnungen
                  wirken selbstverständlich statt inszeniert und geben dem
                  Alltag Raum, statt ihn zu überformen.
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
    </section>
  );
}
