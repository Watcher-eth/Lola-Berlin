import Image from "next/image";
import { Reveal } from "@/components/Reveal";

const houseHighlights = [
  {
    title: "1914 mit neuer Präzision",
    text: "Lola bringt die klassische Berliner Altbauhaltung zurück, ohne historisch zu erstarren. Die Fassade wirkt gesetzt, das Haus klar, ruhig und souverän.",
  },
  {
    title: "Ankommen mit Tiefe",
    text: "Vom Straßenraum bis ins Haus hinein entsteht eine Abfolge, die Orientierung und Ruhe verbindet. Genau daraus wächst das Gefühl, wirklich anzukommen.",
  },
  {
    title: "Charakter statt Kulisse",
    text: "Sanierte Stilelemente, Jugendstil-Anklänge und eine sorgfältige Überarbeitung lassen das Haus wieder als architektonische Persönlichkeit lesbar werden.",
  },
];

export function LandingHouseSection() {
  return (
    <section
      id="house"
      className="border-t border-[var(--accent)]/14 bg-white px-6 py-16 sm:px-8 lg:px-10 lg:py-24"
    >
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <div className="mb-8 border-t border-[var(--accent)]/24 pt-4 lg:mb-10">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--accent)]/72">
              Haus
            </p>
            <h2 className="mt-3 max-w-3xl font-serif text-4xl leading-none tracking-[-0.05em] text-balance text-[var(--accent)] sm:text-5xl">
              Ein Berliner Haus mit Haltung, Tiefe und neuer Substanz.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-black/68">
              Lola ist nicht nur Adresse, sondern architektonische Figur im
              Kiez: sorgfältig erneuert, klar in der Präsenz und präzise in der
              Ausarbeitung vom Gehweg bis ins Hausinnere.
            </p>
          </div>
        </Reveal>

        <Reveal className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(300px,0.9fr)] lg:items-start">
          <div className="relative aspect-[1.6/1] overflow-hidden bg-[var(--accent-soft)]">
            <Image
              src="/Lola.jpg"
              alt="Fassade und Straßenansicht von Lola"
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover object-center"
            />
          </div>

          <div className="space-y-6">
            {houseHighlights.map((item) => (
              <article
                key={item.title}
                className="border-t border-[var(--accent)]/12 pt-4"
              >
                <h3 className="font-serif text-[1.7rem] leading-tight tracking-[-0.04em] text-[var(--accent)]">
                  {item.title}
                </h3>
                <p className="mt-3 text-base leading-8 text-black/68">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </Reveal>

        <Reveal className="mt-14 lg:mt-16" delay={0.08}>
          <div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
            <div>
              <div className="relative aspect-[0.88/1] overflow-hidden bg-[#16120f]">
                <Image
                  src="/Lola.jpg"
                  alt="Detail von Lola mit Altbaucharakter"
                  fill
                  sizes="(min-width: 1024px) 32vw, 100vw"
                  className="object-cover object-left brightness-[0.5] sepia-[0.12]"
                />
              </div>
              <p className="mt-5 max-w-md text-sm leading-7 text-black/62">
                Ein Haus für ein anspruchsvolles Publikum, das Substanz,
                Qualität und Berliner Altbaukultur in zeitgemäßer Form sucht.
              </p>
            </div>

            <div className="rounded-[2rem] bg-[var(--accent)] px-7 py-8 text-white md:px-10 md:py-10">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-white/60">
                Neubaustandard
              </p>
              <h3 className="mt-4 max-w-2xl font-serif text-4xl leading-none tracking-[-0.05em] text-balance sm:text-5xl">
                Altbaucharme, energetisch saniert und vollständig neu gedacht.
              </h3>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/82">
                Über zwei Jahre wurde Lola komplett überarbeitet: technisch,
                energetisch und räumlich. Das Ergebnis ist ein Haus mit
                historischer Tiefe und dem Komfort eines Neubaus.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
