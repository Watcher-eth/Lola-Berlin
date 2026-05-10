import Image from "next/image";
import type { ReactNode } from "react";
import { motion } from "motion/react";
import { SeoHead } from "@/components/SeoHead";
import { SiteHeader } from "@/components/SiteHeader";

type Section = {
  eyebrow: string;
  title: string;
  intro: string;
  body: string;
  iconKind: "education" | "parks" | "shops" | "food" | "transit";
  image?: {
    src: string;
    alt: string;
  };
  items: string[];
};

type KiezListProps = {
  items: string[];
  sectionIndex: number;
};

type MagazineRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

const sections: Section[] = [
  {
    eyebrow: "01 Bildung",
    title: "Ein Umfeld, in dem Familien langfristig planen können.",
    iconKind: "education",
    intro:
      "Wer in ein neues Zuhause zieht, denkt nicht nur an Quadratmeter. Es geht um Wege, Schulprofile, Betreuung, Sprachen, Alltagssicherheit und die Frage, ob Kinder hier gut groß werden können.",
    body:
      "Rund um LOLA liegt eine ungewöhnlich dichte Bildungslandschaft: Grundschulen, weiterführende Schulen, bilinguale und internationale Angebote sowie Kitas und Kinderläden im nahen Umfeld. Das macht den Güntzelkiez besonders für Familien attraktiv, die ein ruhiges Wohnumfeld suchen, ohne auf städtische Vielfalt zu verzichten.",
    image: {
      src: "/neighbourhood/GoetheGym.png",
      alt: "Goethe-Gymnasium im Umfeld des Güntzelkiezes",
    },
    items: [
      "Nelson Mandela School, staatlich bilingual mit Deutsch und Englisch",
      "Comenius-Schule, Birger-Forell-Grundschule und weitere Grundschulen im Umfeld",
      "Robert-Jungk-Oberschule, Goethe-Gymnasium, Friedrich-Ebert-Gymnasium und Marie-Curie-Gymnasium",
      "Nederlandse School Berlijn, Wangari Maathai International School und Annie Heuser Schule",
      "Kitas, Kinderläden und Hortangebote, darunter Ourania e.V. und KuBiS in der Holsteinischen Straße",
    ],
  },
  {
    eyebrow: "02 Parks",
    title: "Grünflächen, die den Alltag leiser und weiter machen.",
    iconKind: "parks",
    intro:
      "Für Familien, Paare und Menschen, die bewusst ruhiger wohnen möchten, ist Grün in Laufnähe kein Extra. Es ist Teil der Wohnqualität.",
    body:
      "Volkspark Wilmersdorf, Fennsee, Rudolph-Wilde-Park und Preußenpark erweitern den Kiez um Spazierwege, Spielplätze, Sportflächen und Orte für kleine Pausen. Gerade im Zusammenspiel mit der ruhigen Holsteinischen Straße entsteht eine Lage, die städtisch bleibt und trotzdem Erholung in den Alltag bringt.",
    image: {
      src: "/neighbourhood/Volkspark.png",
      alt: "Volkspark Wilmersdorf als grüne Umgebung von LOLA",
    },
    items: [
      "Volkspark Wilmersdorf für Spaziergänge, Jogging und tägliche Bewegung",
      "Fennsee und Rudolph-Wilde-Park als grüne Verbindung durch Wilmersdorf",
      "Preußenpark und weitere Spiel- und Aufenthaltsorte im Umfeld",
      "Grüne Straßenräume, die den klassischen Altbaukiez besonders wohnlich machen",
    ],
  },
  {
    eyebrow: "03 Läden & Unterhaltung",
    title: "Nahversorgung mit Charakter statt anonymer Einkaufsroutine.",
    iconKind: "shops",
    intro:
      "Der Güntzelkiez funktioniert im Alltag, weil vieles in kurzer Distanz liegt: Feinkost, Supermarkt, Bäckerei, Buchhandlung, Blumen, Mode, Wein und kleine Dienstleistungen.",
    body:
      "Diese Mischung ist entscheidend für Menschen, die hier nicht nur eine Wohnung mieten, sondern wirklich ankommen möchten. Der Kiez wirkt gewachsen, alltagsnah und zugleich kultiviert. Dazu kommt die schnelle Nähe zur City West und zum Kurfürstendamm, wenn es größer, urbaner oder repräsentativer werden soll.",
    image: {
      src: "https://www.iz.de/news/media/40/Entwurf-Henning-Larsen-Kudamm-399304.jpeg",
      alt: "Kurfürstendamm und City West als nahe Einkaufs- und Kulturadresse",
    },
    items: [
      "Güntzel Feinkost, Bellwinkel, Nah & gut mit Fleischerei, Bio Backhaus und Weinhandlung Bruhn",
      "Buchhandlung Ferlemann und Schatzer, Blumen Eliza, Parfümerie und kleine Spezialgeschäfte",
      "Magazzino, Tatem Outlet, Kuckuck Berlin, Kindermode und kuratierte Modeadressen",
      "Wochenmarkt am Hohenzollerndamm mittwochs und samstags",
      "Kurfürstendamm, Charlottenburg und City West in kurzer Distanz",
    ],
  },
  {
    eyebrow: "04 Restaurants & Cafés",
    title: "Ein Kiez für Frühstück, Feierabend und vertraute Lieblingsorte.",
    iconKind: "food",
    intro:
      "Die Gastronomie im Umfeld ist nicht laut inszeniert. Sie lebt von Cafés, Restaurants und kleinen Adressen, die man regelmäßig nutzt.",
    body:
      "Für neue Bewohnerinnen und Bewohner ist genau das wertvoll: ein Frühstück um die Ecke, Kaffee zwischen Terminen, ein Restaurant für den Abend, ein Ort für Besuch aus der Familie. Der Güntzelkiez bietet diese Alltagskultur in einer Form, die persönlich und angenehm unaufgeregt bleibt.",
    image: {
      src: "/neighbourhood/Uhland.png",
      alt: "Uhland's Café im Güntzelkiez",
    },
    items: [
      "Uhland's Café, When Dreams Come True, Amo Coffee Shop, Adams Café und Café Eulinchen",
      "PUZZLE Coffee & Pastry für einen hochwertigen Coffee- und Breakfast-Alltag",
      "Gapshap mit moderner indischer Küche",
      "Cozy mit vietnamesischer Küche, Pho und Sushi",
      "Nea Knosso sowie italienische, afrikanische, peruanische und weitere Küchen im Umfeld",
    ],
  },
  {
    eyebrow: "05 Alltag & Anbindung",
    title: "Ruhig wohnen und trotzdem schnell in Berlin sein.",
    iconKind: "transit",
    intro:
      "Eine gute Lage zeigt sich in den Wegen, die man jeden Tag nicht erklären muss: zur Bahn, zum Bus, zum Fahrradkeller, zur Apotheke, zum Markt, zur Familie, zur Arbeit.",
    body:
      "LOLA liegt in einer ruhigen Seitenstraße und ist trotzdem sehr gut angebunden. U3, U7 und U9 liegen je nach Ziel in gut erreichbarer Entfernung, Bus- und Nachtlinien ergänzen die Mobilität. Die Ringbahn am Bundesplatz ist etwas weiter entfernt, bleibt aber erreichbar. Nur wenige Schritte vom Haus befinden sich zudem öffentliche Ladepunkte für Elektrofahrzeuge.",
    items: [
      "U Hohenzollernplatz für die U3 in etwa sieben Minuten zu Fuß",
      "U Blissestraße für die U7 in etwa sieben Minuten zu Fuß",
      "U Güntzelstraße und U9 für Verbindungen Richtung Osloer Straße und Rathaus Steglitz",
      "Buslinien und Nachtbusse wie N3, N7, N9, N43 und N7X im Umfeld",
      "S Bundesplatz mit Ringbahn S41/S42 in rund 1,2 Kilometern Entfernung",
    ],
  },
];

function MagazineReveal({
  children,
  className,
  delay = 0,
}: MagazineRevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 38 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function LineIcon({
  kind,
  index,
}: {
  kind: Section["iconKind"];
  index: number;
}) {
  const variant = index % 3;

  if (kind === "education" && variant === 0) {
    return (
      <svg viewBox="0 0 80 80" className="h-12 w-12 shrink-0" aria-hidden>
        <path
          d="M18 58h44V24H18v34ZM26 32h28M26 42h20M26 52h12M56 24v34"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (kind === "education") {
    return (
      <svg viewBox="0 0 80 80" className="h-12 w-12 shrink-0" aria-hidden>
        <path
          d="M24 24h32v34H24V24ZM30 24v-5h20v5M32 38h16M32 48h10M20 64h40"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (kind === "parks") {
    return (
      <svg viewBox="0 0 80 80" className="h-12 w-12 shrink-0" aria-hidden>
        <path
          d="M40 12v56M20 46l20-32 20 32M24 58l16-26 16 26"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (kind === "shops") {
    return (
      <svg viewBox="0 0 80 80" className="h-12 w-12 shrink-0" aria-hidden>
        <path
          d="M20 34h40l-4 28H24l-4-28ZM30 34V24a10 10 0 0 1 20 0v10M28 46h24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (kind === "food") {
    return (
      <svg viewBox="0 0 80 80" className="h-12 w-12 shrink-0" aria-hidden>
        <path
          d="M24 24h32v20a16 16 0 0 1-32 0V24ZM20 62h40M56 30h6a8 8 0 0 1 0 16h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 80 80" className="h-12 w-12 shrink-0" aria-hidden>
      <path
        d="M18 54h44M26 54V28h28v26M32 28v-8h16v8M34 42h12M20 62h40"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function KiezList({ items, sectionIndex }: KiezListProps) {
  const kind = sections[sectionIndex].iconKind;

  return (
    <motion.div
      className="grid gap-5 py-4 text-[#3f422d] md:grid-cols-[auto_1fr] md:gap-8"
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.32 }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.34em] text-[#8a4432]/78 md:[writing-mode:vertical-rl] md:rotate-180">
        Direkt im Umfeld
      </p>
      <div className="space-y-5">
        {items.map((item, index) => (
          <motion.p
            key={item}
            className={`flex items-center gap-4 font-serif text-2xl leading-[1.06] tracking-[-0.035em] sm:text-3xl lg:text-[2.55rem] ${
              index > 0 ? "border-t border-[#3f422d]/16 pt-5" : ""
            }`}
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: 0.7,
              delay: index * 0.07,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <LineIcon kind={kind} index={index} />
            <span>{item}</span>
          </motion.p>
        ))}
      </div>
    </motion.div>
  );
}

function AnimatedImage({ src, alt }: { src: string; alt: string }) {
  return (
    <motion.div
      className="relative aspect-[1.45/1] overflow-hidden border border-white/80 bg-white shadow-[0_20px_55px_rgba(50,52,38,0.12)]"
      initial={{ opacity: 0, y: 42, clipPath: "inset(10% 0% 0% 0%)" }}
      whileInView={{ opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, amount: 0.28 }}
      transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.06 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.28 }}
        transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 44vw, 100vw"
          className="object-cover"
        />
      </motion.div>
    </motion.div>
  );
}

function TransitPanel() {
  return (
    <motion.div
      className="flex aspect-[1.45/1] flex-col justify-between border border-[#3f422d]/18 bg-[#ded8ca] p-5 text-[#3f422d] shadow-[0_20px_55px_rgba(50,52,38,0.08)] sm:p-7"
      initial={{ opacity: 0, y: 42, clipPath: "inset(10% 0% 0% 0%)" }}
      whileInView={{ opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, amount: 0.28 }}
      transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#8a4432]">
        Mobilität
      </p>
      <div className="space-y-3">
        <p className="font-serif text-[2.8rem] leading-none tracking-[-0.05em] sm:text-[5.4rem]">
          U3 U7 U9
        </p>
        <div className="flex flex-col items-start gap-4 text-[#3f422d]/72 sm:flex-row sm:items-center sm:gap-5">
          <LineIcon kind="transit" index={0} />
          <p className="max-w-xs text-base leading-7">
            Kurze Wege zur U-Bahn, Buslinien, Nachtverkehr und Ringbahn-Anschluss
            im erweiterten Umfeld.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function KiezPage() {
  return (
    <>
      <SeoHead
        title="Kiez"
        description="Der Güntzelkiez rund um LOLA: Bildung, Parks, Cafés, Restaurants, Nahversorgung, Anbindung und Karte für Menschen, die hier wohnen möchten."
        path="/kiez"
      />

      <div className="bg-[#f7f3ea] text-[#171713]">
        <div className="relative min-h-[108px] bg-[#f7f3ea] md:min-h-[124px]">
          <SiteHeader theme="paper" />
        </div>

        <main>
          <section className="px-6 py-[4.5rem] sm:px-8 lg:px-10 lg:py-24">
            <div className="mx-auto w-full max-w-7xl">
              <MagazineReveal>
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#8a4432]">
                  Leben im Güntzelkiez
                </p>
                <h1 className="mt-5 w-full font-serif text-[2.9rem] leading-[0.92] tracking-[-0.045em] text-[#3f422d] sm:text-[5.4rem] lg:text-[7.2rem]">
                  Dein Zuhause im Herzen von Berlin.
                </h1>
                <motion.div
                  className="mt-9 w-full space-y-5 border-t border-[#3f422d]/20 pt-7"
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.35 }}
                  variants={{
                    hidden: {},
                    show: { transition: { staggerChildren: 0.12 } },
                  }}
                >
                  <motion.p
                    className="text-lg leading-8 text-[#171713]/78 sm:text-2xl sm:leading-10 md:text-3xl md:leading-[1.22]"
                    variants={{
                      hidden: { opacity: 0, y: 24 },
                      show: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                  >
                    LOLA entsteht in einer ruhigen Seitenstraße des
                    Güntzelkiezes in Wilmersdorf: ein außergewöhnliches
                    Wohnobjekt, das klassischen Berliner Altbaucharme mit
                    Neubaustandard, Energieeffizienzklasse A und einem hohen
                    Komfortniveau verbindet.
                  </motion.p>
                </motion.div>
              </MagazineReveal>
            </div>
          </section>

          {sections.map((section, index) => (
            <section
              key={section.eyebrow}
              className={`px-6 py-16 sm:px-8 lg:px-10 lg:py-[5.5rem] ${
                index % 2 === 0 ? "bg-[#f7f3ea]" : "bg-[#ece7dc]"
              }`}
            >
              <div className="mx-auto w-full max-w-7xl">
                <MagazineReveal
                  delay={index * 0.03}
                >
                  <article>
                    <div className="mb-9">
                      <p className="font-mono text-xs uppercase tracking-[0.26em] text-[#8a4432]">
                        {section.eyebrow}
                      </p>
                      <h2 className="mt-5 max-w-4xl font-serif text-3xl leading-none tracking-[-0.04em] text-[#3f422d] sm:text-5xl">
                        {section.title}
                      </h2>
                    </div>

                    <div className="grid gap-10 lg:grid-cols-[0.48fr_0.52fr] lg:items-start lg:gap-16">
                      {section.image ? (
                        <AnimatedImage
                          src={section.image.src}
                          alt={section.image.alt}
                        />
                      ) : (
                        <TransitPanel />
                      )}

                      <div className="space-y-6 lg:pt-2">
                        <p className="text-lg leading-8 text-[#171713]/78 sm:text-2xl sm:leading-10">
                          {section.intro}
                        </p>
                        <p className="text-base leading-7 text-[#171713]/68 sm:text-lg sm:leading-8">
                          {section.body}
                        </p>
                      </div>
                    </div>

                    <div className="mt-10 lg:mt-12">
                      <KiezList items={section.items} sectionIndex={index} />
                    </div>
                  </article>
                </MagazineReveal>
              </div>
            </section>
          ))}

          <section className="bg-[#323c2d] px-6 py-[4.5rem] text-white sm:px-8 lg:px-10 lg:py-24">
            <div className="mx-auto w-full max-w-7xl">
              <div className="grid gap-10 lg:grid-cols-[0.7fr_1fr] lg:items-end">
                <MagazineReveal>
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.26em] text-white/58">
                      Karte
                    </p>
                    <h2 className="mt-5 font-serif text-4xl leading-none tracking-[-0.045em] sm:text-6xl">
                      Alles, was den Alltag trägt.
                    </h2>
                  </div>
                </MagazineReveal>

                <MagazineReveal delay={0.08}>
                  <p className="max-w-3xl text-base leading-7 text-white/72 sm:text-xl sm:leading-9 lg:justify-self-end">
                    Die Karte zeigt, warum die Lage von LOLA so gut
                    funktioniert: Bildung, Grün, Cafés, Restaurants,
                    Nahversorgung und Mobilität liegen in einem Radius, der
                    Wohnen im Güntzelkiez bequem, ruhig und langfristig
                    attraktiv macht.
                  </p>
                </MagazineReveal>
              </div>
              <MagazineReveal delay={0.12}>
                <div className="mt-16 w-full border border-white bg-[#fbfaf5] p-2 shadow-[0_28px_70px_rgba(0,0,0,0.28)] sm:p-3 lg:p-4">
                  <Image
                    src="/MapH18.png"
                    alt="Karte des Güntzelkiezes rund um die Holsteinische Straße 18"
                    width={1500}
                    height={1049}
                    sizes="100vw"
                    className="h-auto w-full"
                  />
                </div>
              </MagazineReveal>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
