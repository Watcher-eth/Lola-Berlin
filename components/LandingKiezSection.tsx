import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Reveal } from "@/components/Reveal";

function TramIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 64 64"
      className="h-12 w-12 stroke-current md:h-16 md:w-16"
      fill="none"
      strokeWidth="1.5"
    >
      <path d="M24 10h16m-8 0V4m-16 16c0-4.418 3.582-8 8-8h16c4.418 0 8 3.582 8 8v22c0 3.314-2.686 6-6 6H22c-3.314 0-6-2.686-6-6V20Z" />
      <path d="M22 24h20M24 32v8m16-8v8M18 52h28M24 48l-4 10m20-10 4 10" />
    </svg>
  );
}

function TreeIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 64 64"
      className="h-12 w-12 stroke-current md:h-16 md:w-16"
      fill="none"
      strokeWidth="1.5"
    >
      <path d="M32 58V34" />
      <path d="M32 10c0 8-10 8-10 16 0 2.5 1.2 4.6 3 6 0-3 2-4 4-6-1 5 4 7 4 12 0-5 5-7 4-12 2 2 4 3 4 6 1.8-1.4 3-3.5 3-6 0-8-10-8-10-16Z" />
      <path d="M20 34c0-7 8-8 12-14 4 6 12 7 12 14M18 48h28" />
    </svg>
  );
}

function CupIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 64 64"
      className="h-12 w-12 stroke-current md:h-16 md:w-16"
      fill="none"
      strokeWidth="1.5"
    >
      <path d="M18 24h26v14c0 8-5 14-13 14s-13-6-13-14V24Z" />
      <path d="M44 28h4c4 0 6 2 6 6s-2 6-6 6h-2M18 56h28" />
    </svg>
  );
}

const kiezFacts = [
  { text: "2 Minuten zum Preußenpark", icon: <TramIcon /> },
  { text: "10 Minuten zum KaDeWe" },
  { text: "15 Minuten bis zum Grunewald", icon: <TreeIcon /> },
  { text: "8 Minuten zur U Güntzelstraße" },
  { text: "5 Minuten zum Wochenmarkt" },
  { text: "1 Espresso bis zum Wachsein", icon: <CupIcon /> },
];

export function LandingKiezSection() {
  return (
    <section
      id="kiez"
      className="overflow-hidden bg-[#06160f] px-6 py-20 text-[#edf1ea] sm:px-8 lg:px-10 lg:py-28"
    >
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-12 lg:grid-rows-[auto_auto_auto] lg:gap-x-10 lg:gap-y-8">
            <div className="lg:col-span-5 lg:row-start-1">
              <h2 className="font-serif text-[18vw] leading-[0.88] tracking-[-0.06em] text-[#e9eee8] sm:text-[15vw] lg:text-[8.3rem]">
                Leben
              </h2>
            </div>

            <div className="lg:col-span-6 lg:col-start-7 lg:row-start-1 lg:pt-2">
             <div className="relative aspect-[1.78/1] overflow-hidden">
                <Image
                  src="https://www.berlin.de/binaries/asset/image_assets/912168/source/1625477461/1000x500/"
                  alt="Blick auf das Haus Lola"
                  fill
                  sizes="(min-width: 1024px) 38vw, 100vw"
                  className="object-cover object-center grayscale contrast-[1.05] brightness-[0.92]"
                />
              </div>
            </div>

            <div className="lg:col-span-5 lg:row-start-2">
              <div className="relative aspect-[1.78/1] overflow-hidden">
                <Image
                  src="https://images.ctfassets.net/if6f7uzjzqut/3qQk0SK7UaDXkt0ZcbNJUY/fdc73a6a26cb47172fb9568f3175cc39/Berlin_WiIlmersdorf_Charlottenburg_Fassade_Wohnen.jpg"
                  alt="Blick auf das Haus Lola"
                  fill
                  sizes="(min-width: 1024px) 38vw, 100vw"
                  className="object-cover object-[50%_30%] grayscale contrast-[1.05] brightness-[0.92]"
                />
              </div>
            </div>

            <div className="flex items-end lg:col-span-5 lg:col-start-7 lg:row-start-2">
              <h2 className="font-serif text-[15vw] leading-[0.88] tracking-[-0.06em] text-[#e9eee8] sm:text-[13vw] lg:text-[7.2rem]">
                Mitten
              </h2>
            </div>

            <div className="lg:col-span-8 lg:row-start-3">
              <h2 className="font-serif text-[15vw] leading-[0.88] tracking-[-0.06em] text-[#e9eee8] sm:text-[13vw] lg:text-[7.2rem]">
                im Güntzelkiez
              </h2>
            </div>

          
          </div>
        </Reveal>

        <Reveal className="mt-16 lg:mt-32" delay={0.08}>
          <div className="grid gap-8 lg:grid-cols-[88px_minmax(0,1fr)] lg:gap-12">
            <div className="flex lg:justify-center">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#d7ddd4] lg:[writing-mode:vertical-rl] lg:rotate-180">
                Den Kiez in alle Richtungen entdecken
              </p>
            </div>

            <div className="space-y-4 md:space-y-5">
              {kiezFacts.map((fact, index) => (
                <motion.div
                  key={fact.text}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.45 }}
                  transition={{
                    delay: index * 0.06,
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="flex flex-col items-start gap-3 text-[#e9eee8] sm:flex-row sm:items-center sm:gap-4"
                >
                  <p className="font-serif text-[9vw] leading-[0.9] tracking-[-0.05em] sm:text-[8vw] lg:text-[4.35rem]">
                    {fact.text}
                  </p>
                  {fact.icon ? (
                    <span className="shrink-0 text-[#d7ddd4]">{fact.icon}</span>
                  ) : null}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex justify-start sm:justify-end">
            <Link
              href="/kiez"
              className="inline-flex w-full justify-center rounded-full border border-[#d7ddd4]/30 px-6 py-3 font-mono text-xs uppercase tracking-[0.22em] text-[#edf1ea] transition-all duration-500 hover:bg-white hover:text-[#06160f] sm:w-auto"
              style={{ ["--hover-section-color" as string]: "#06160f" }}
            >
              Mehr zum Kiez
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
