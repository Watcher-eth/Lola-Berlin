import { motion } from "motion/react";

const apartmentStandards = [
  "Fernwärme und Fußbodenheizung für effiziente, angenehme Wärme",
  "Energieeffizienzklasse A und energetisch saniertes Haus auf Neubaustandard",
  "Glasfaser- und Highspeed-Internet für einen zeitgemäßen Alltag",
  "Moderne, voll geflieste Badezimmer und fest eingebaute Küchen",
  "Zertifizierter Bio-Boden oder Parkett mit ruhiger, hochwertiger Haptik",
];

const houseConveniences = [
  "Drei Aufzüge im Haus für hohen Komfort im Alltag",
  "Liebevoll gestalteter, grüner Innenhof",
  "Fahrradkeller, per Aufzug erreichbar",
  "Zentraler Müllbereitstellungsraum im Untergeschoss",
  "Bezug ab Herbst 2026 beziehungsweise Jahresanfang 2027",
];

export function ApartmentFeaturesSection() {
  return (
    <section className="border-t border-[var(--accent)]/14 bg-white px-6 py-16 sm:px-8 lg:px-10 lg:py-24">
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(320px,1.1fr)] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.24 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--accent)]/72">
              Wohnstandard
            </p>
            <h2 className="mt-4 max-w-4xl font-serif text-3xl leading-none tracking-[-0.05em] text-[var(--accent)] sm:text-5xl lg:text-[4rem]">
              Altbaucharme, technisch auf aktuellem Stand.
            </h2>
            <div className="mt-6 space-y-5 text-sm leading-7 text-black/66 sm:text-base sm:leading-8 md:text-lg">
              <p>
                Im Güntzelkiez in Berlin-Wilmersdorf entsteht in einer ruhigen
                Seitenstraße ein Wohnhaus, das den klassischen Altbau mit dem
                Komfort und den technischen Vorteilen eines Neubaus verbindet.
              </p>
              <p>
                Das Haus wird von der Eigentümerin aufwendig kern- und
                energetisch saniert. Von der Substanz über die Gebäudetechnik
                bis zu den Ausstattungsdetails entsteht ein Neubaustandard mit
                hohem Energie- und Komfortniveau.
              </p>
              <p>
                Zum Erstbezug ab Herbst 2026 und Jahresanfang 2027 erwartet die
                künftigen Bewohnerinnen und Bewohner ein Zuhause, das den
                Charakter klassischer Berliner Altbauwohnungen hält und ihn mit
                ruhiger, zeitgemäßer Wohnqualität verbindet.
              </p>
            </div>
          </motion.div>

          <motion.div
            className="grid gap-10 md:grid-cols-2 md:gap-8"
            initial={{ opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.24 }}
            transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)]/58">
                In den Wohnungen
              </p>
              <div className="mt-4 space-y-4">
                {apartmentStandards.map((item, index) => (
                  <p
                    key={item}
                    className={`text-sm leading-7 text-black/68 sm:text-base ${
                      index > 0 ? "border-t border-[var(--accent)]/12 pt-4" : ""
                    }`}
                  >
                    {item}
                  </p>
                ))}
              </div>
            </div>

            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent)]/58">
                Im Haus
              </p>
              <div className="mt-4 space-y-4">
                {houseConveniences.map((item, index) => (
                  <p
                    key={item}
                    className={`text-sm leading-7 text-black/68 sm:text-base ${
                      index > 0 ? "border-t border-[var(--accent)]/12 pt-4" : ""
                    }`}
                  >
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
