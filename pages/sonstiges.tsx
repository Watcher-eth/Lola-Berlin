import { SeoHead } from "@/components/SeoHead";
import { SiteHeader } from "@/components/SiteHeader";

export default function SonstigesPage() {
  return (
    <>
      <SeoHead
        title="Haftungsausschluss"
        description="Hinweise zu Angaben, Visualisierungen und Grundrissen der LOLA Website."
        path="/sonstiges"
      />
      <div className="min-h-screen bg-[#f7f3ea] text-[#171713]">
        <div className="relative min-h-[108px] bg-[#f7f3ea] md:min-h-[124px]">
          <SiteHeader theme="paper" />
        </div>
        <main className="px-6 py-16 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-4xl">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#8a4432]">
              Rechtliches
            </p>
            <h1 className="mt-5 font-serif text-5xl leading-none tracking-[-0.05em] text-[#3f422d] sm:text-7xl">
              Haftungsausschluss
            </h1>
            <div className="mt-10 space-y-7 border-t border-[#3f422d]/20 pt-8 text-lg leading-8 text-[#171713]/74">
              <p>
                Alle Angaben auf dieser Website zum Projekt LOLA,
                Holsteinische Straße 18, Berlin-Wilmersdorf, dienen der ersten
                Information. Änderungen bleiben vorbehalten.
              </p>
              <p>
                Grundrisse, Flächen, Wohnungsschnitte, Verfügbarkeiten,
                Ausstattungsangaben und Preise sind unverbindlich. Maßgeblich
                sind ausschließlich die finalen Vertragsunterlagen und die darin
                ausdrücklich vereinbarten Angaben.
              </p>
              <p>
                Visualisierungen, Renderings, Fotos und Beispielbilder zeigen
                mögliche Stimmungen, Materialien und Raumsituationen. Sie müssen
                nicht in jedem Detail der späteren Ausführung oder der
                jeweiligen Wohnung entsprechen.
              </p>
              <p>
                Die Wohnungen sind unmöbliert. Angaben zu Flächen,
                Grundrissen, Ausstattungen und weiteren Details sind bis zum
                Vertragsabschluss unverbindlich.
              </p>
              <p>
                Diese Website begründet kein Angebot zum Abschluss eines
                Mietvertrags und keine Reservierung einer bestimmten Wohnung.
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
