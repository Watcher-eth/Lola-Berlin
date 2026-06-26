import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { motion } from "motion/react";
import { SeoHead } from "@/components/SeoHead";
import { SiteHeader } from "@/components/SiteHeader";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

const restorationDetails = [
  "Behutsam restaurierte Altbaudetails mit Jugendstilcharakter",
  "Kern- und energetische Sanierung auf Neubaustandard",
  "Fernwärme und Fußbodenheizung für ruhigen, gleichmäßigen Komfort",
  "Drei Aufzüge, Fahrradkeller und geordnete Hauslogistik",
  "Glasfaser, hochwertige Böden und sorgfältig ausgeführte Bäder",
];

function Reveal({ children, className, delay = 0 }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.24 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function DetailList() {
  return (
    <motion.div
      className="mt-10 grid gap-5 border-y-0 py-2 text-[#3f422d] md:grid-cols-[auto_1fr] md:gap-8"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.34em] text-[#8a4432]/78 md:[writing-mode:vertical-rl] md:rotate-180">
        Ausstattung
      </p>
      <div className="space-y-4">
        {restorationDetails.map((item, index) => (
          <motion.p
            key={item}
            className={`font-serif text-2xl leading-[1.08] tracking-[-0.035em] sm:text-3xl ${
              index > 0 ? "border-t border-[#3f422d]/16 pt-4" : ""
            }`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: 0.65,
              delay: index * 0.06,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {item}
          </motion.p>
        ))}
      </div>
    </motion.div>
  );
}

export default function HousePage() {
  return (
    <>
      <SeoHead
        title="Haus"
        description="LOLA in Berlin-Wilmersdorf: Geschichte, Sanierung und Lage des Hauses in der Holsteinischen Straße 18."
        path="/haus"
      />

      <div className="bg-[#f7f3ea] text-[#171713]">
        <div className="relative min-h-[108px] bg-[#f7f3ea] md:min-h-[124px]">
          <SiteHeader theme="paper" />
        </div>

        <main>
          <section className="px-6 py-[4.5rem] sm:px-8 lg:px-10 lg:py-24">
            <div className="mx-auto w-full max-w-7xl">
              <Reveal>
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#8a4432]">
                  Das Haus
                </p>
                <h1 className="mt-5 max-w-6xl font-serif text-[2.9rem] leading-[0.92] tracking-[-0.045em] text-[#3f422d] sm:text-[5.4rem] lg:text-[7.2rem]">
                  Altbaucharme, neu gedacht.
                </h1>
                <p className="mt-8 max-w-5xl border-t border-[#3f422d]/20 pt-7 text-lg leading-8 text-[#171713]/76 sm:text-2xl sm:leading-10 md:text-3xl md:leading-[1.22]">
                  In der Holsteinischen Straße 18 entsteht ein Haus, das die
                  Eleganz des Berliner Altbaus, feine Jugendstil-Anklänge und
                  eine aufwendig restaurierte Substanz mit heutigem Komfort
                  verbindet.
                  Wunderschöne Altbauwohnungen mit Neubaustandard sind von der
                  Eigentümerin provisionsfrei zu mieten.
                </p>
              </Reveal>
            </div>
          </section>

          <section className="bg-[#ece7dc] px-6 py-16 sm:px-8 lg:px-10 lg:py-[5.5rem]">
            <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[0.42fr_0.58fr] lg:items-start lg:gap-16">
              <Reveal>
                <p className="font-mono text-xs uppercase tracking-[0.26em] text-[#8a4432]">
                  01 Geschichte
                </p>
                <h2 className="mt-5 font-serif text-3xl leading-none tracking-[-0.04em] text-[#3f422d] sm:text-5xl">
                  Ein Altbau aus der Blütezeit Wilmersdorfs.
                </h2>
              </Reveal>

              <Reveal delay={0.08}>
                <div className="space-y-5 text-base leading-7 text-[#171713]/70 sm:text-lg sm:leading-8">
                  <p>
                    Der Güntzelkiez entstand Ende des 19. und Anfang des 20.
                    Jahrhunderts im Zuge der rasanten Entwicklung der City
                    West. In dieser Zeit entstanden rund um die heutige
                    Güntzelstraße elegante Berliner Wohnhäuser mit hohen
                    Decken, gegliederten Fassaden und großzügigen Grundrissen.
                  </p>
                  <p>
                    LOLA gehört zu dieser Baukultur. Das Haus trägt noch heute
                    den Charme des klassischen Altbaus in sich: Proportion,
                    Ornament, Großzügigkeit und jene ruhige Selbstverständlichkeit,
                    die viele Berliner Häuser dieser Epoche so besonders macht.
                  </p>
                </div>
              </Reveal>
            </div>
          </section>

          <section className="bg-[#f7f3ea] px-6 py-16 sm:px-8 lg:px-10 lg:py-[5.5rem]">
            <div className="mx-auto w-full max-w-7xl">
              <Reveal>
                <p className="font-mono text-xs uppercase tracking-[0.26em] text-[#8a4432]">
                  02 Restaurierung
                </p>
                <h2 className="mt-5 max-w-5xl font-serif text-3xl leading-none tracking-[-0.04em] text-[#3f422d] sm:text-5xl">
                  Behutsam restauriert, technisch vollständig erneuert.
                </h2>
              </Reveal>

              <div className="mt-10 grid gap-10 lg:grid-cols-[0.48fr_0.52fr] lg:items-start lg:gap-16">
                <Reveal>
                  <motion.div
                    className="relative aspect-[1.45/1] overflow-hidden border border-white/80 bg-white shadow-[0_20px_55px_rgba(50,52,38,0.12)]"
                    initial={{ opacity: 0, y: 42, scale: 1.02 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, amount: 0.28 }}
                    transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Image
                      src="/Lola.jpg"
                      alt="LOLA in der Holsteinischen Straße 18"
                      fill
                      sizes="(min-width: 1024px) 44vw, 100vw"
                      className="object-cover"
                    />
                  </motion.div>
                </Reveal>

                <Reveal delay={0.08}>
                  <div>
                    <div className="space-y-5 text-base leading-7 text-[#171713]/70 sm:text-lg sm:leading-8">
                      <p>
                        LOLA wird mit großer Sorgfalt kern- und energetisch
                        saniert. Wo immer es möglich ist, werden prägende
                        Elemente des Hauses restauriert und in ihrer Wirkung
                        gestärkt, statt sie zu überformen.
                      </p>
                      <p>
                        So entsteht ein Altbau, der seine historische Haltung
                        behält und zugleich technisch neu aufgestellt ist: mit
                        hoher Energieeffizienz, zeitgemäßer Gebäudetechnik und
                        einem Ausstattungsniveau, das den Charakter des Hauses
                        nicht verdrängt, sondern präzise ergänzt.
                      </p>
                    </div>
                    <DetailList />
                  </div>
                </Reveal>
              </div>
            </div>
          </section>

          <section className="bg-[#323c2d] px-6 py-16 text-white sm:px-8 lg:px-10 lg:py-[5.5rem]">
            <div className="mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-[0.42fr_0.58fr] lg:items-start lg:gap-16">
              <Reveal>
                <p className="font-mono text-xs uppercase tracking-[0.26em] text-white/58">
                  03 Lage
                </p>
                <h2 className="mt-5 font-serif text-3xl leading-none tracking-[-0.04em] text-white sm:text-5xl">
                  Ein restaurierter Altbau in einem gewachsenen Berliner Kiez.
                </h2>
              </Reveal>

              <Reveal delay={0.08}>
                <div className="space-y-7">
                  <div className="space-y-5 text-base leading-7 text-white/72 sm:text-lg sm:leading-8">
                    <p>
                      Der Güntzelkiez ist einer jener Berliner Stadtteile, in
                      denen Altbaucharme nicht inszeniert wirkt, sondern
                      selbstverständlich da ist: begrünte Straßen,
                      wohnliche Fassaden, kleine Cafés und eine ruhige,
                      kultivierte Alltagsstruktur.
                    </p>
                    <p>
                      Genau in dieses Umfeld fügt sich LOLA ein. Das Haus ist
                      nicht nur technisch erneuert, sondern auch atmosphärisch
                      am richtigen Ort: mitten in einem Quartier, das die
                      klassische Berliner Wohnkultur bis heute trägt.
                    </p>
                  </div>

                  <Link
                    href="/kiez"
                    className="inline-flex border border-white/42 px-5 py-3 font-mono text-xs uppercase tracking-[0.22em] text-white transition-colors duration-300 hover:bg-white hover:text-[#323c2d]"
                  >
                    Kiez entdecken
                  </Link>
                </div>
              </Reveal>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
