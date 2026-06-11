import type { ReactNode } from "react";
import { SeoHead } from "@/components/SeoHead";
import { SiteHeader } from "@/components/SiteHeader";

function LegalBlock({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-[#3f422d]/18 pt-7">
      <h2 className="font-serif text-2xl leading-tight tracking-[-0.03em] text-[#3f422d]">
        {title}
      </h2>
      <div className="mt-4 space-y-3 text-base leading-8 text-[#171713]/74">
        {children}
      </div>
    </section>
  );
}

export default function ImpressumPage() {
  return (
    <>
      <SeoHead
        title="Impressum"
        description="Impressum der LOLA Website für das Wohnprojekt Holsteinische Straße 18 in Berlin-Wilmersdorf."
        path="/impressum"
      />
      <div className="min-h-screen bg-[#f7f3ea] text-[#171713]">
        <div className="relative min-h-[108px] bg-[#f7f3ea] md:min-h-[124px]">
          <SiteHeader theme="paper" />
        </div>
        <main className="px-6 py-16 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-4xl">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#8a4432]">
              Angaben gemäß § 5 DDG
            </p>
            <h1 className="mt-5 font-serif text-5xl leading-none tracking-[-0.05em] text-[#3f422d] sm:text-7xl">
              Impressum
            </h1>

            <div className="mt-10 space-y-10">
              <LegalBlock title="Eigentümer">
                <p>
                  AFG Immobilien Anlage GmbH &amp; Co. KG
                  <br />
                  Holsteinische Straße 18
                  <br />
                  D - 10717 Berlin
                </p>
              </LegalBlock>

              <LegalBlock title="Kontakt">
                <p>
                  Fon: +49 30 84315490
                  <br />
                  Mail:{" "}
                  <a
                    href="mailto:info@afg-ia.de"
                    className="text-[#3f422d] underline decoration-[#3f422d]/30 underline-offset-4"
                  >
                    info@afg-ia.de
                  </a>
                </p>
              </LegalBlock>

              <LegalBlock title="Vertretung und Register">
                <p>Geschäftsführerin: Anja Follmer-Greiff</p>
                <p>
                  Amtsgericht Berlin-Charlottenburg
                  <br />
                  HRA 63359
                </p>
              </LegalBlock>

              <LegalBlock title="Steuerdaten">
                <p>USt-IdNr.: DE451518706</p>
                <p>Steuernr.: 27/154/50240</p>
              </LegalBlock>

              <LegalBlock title="Bankverbindung">
                <p>
                  HypoVereinsbank
                  <br />
                  IBAN: DE61 7112 0077 0043 9974 08
                  <br />
                  BIC: HYVEDEMM448
                </p>
              </LegalBlock>

              <LegalBlock title="Projekt">
                <p>
                  Diese Website informiert über das Mietwohnprojekt LOLA in der
                  Holsteinischen Straße 18 in Berlin-Wilmersdorf.
                </p>
              </LegalBlock>

              <LegalBlock title="Haftung für Inhalte">
                <p>
                  Die Inhalte dieser Website wurden mit größter Sorgfalt
                  erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität
                  der Inhalte können wir jedoch keine Gewähr übernehmen.
                </p>
                <p>
                  Als Diensteanbieter sind wir nach den allgemeinen Gesetzen
                  für eigene Inhalte auf diesen Seiten verantwortlich. Eine
                  Verpflichtung zur Überwachung übermittelter oder gespeicherter
                  fremder Informationen besteht jedoch erst ab dem Zeitpunkt der
                  Kenntnis einer konkreten Rechtsverletzung. Bei Bekanntwerden
                  entsprechender Rechtsverletzungen werden wir diese Inhalte
                  umgehend entfernen.
                </p>
              </LegalBlock>

              <LegalBlock title="Haftung für Links">
                <p>
                  Unser Angebot enthält Links zu externen Websites Dritter, auf
                  deren Inhalte wir keinen Einfluss haben. Deshalb können wir
                  für diese fremden Inhalte auch keine Gewähr übernehmen.
                </p>
                <p>
                  Für die Inhalte der verlinkten Seiten ist stets der jeweilige
                  Anbieter oder Betreiber der Seiten verantwortlich. Bei
                  Bekanntwerden von Rechtsverletzungen werden wir derartige
                  Links umgehend entfernen.
                </p>
              </LegalBlock>

              <LegalBlock title="Urheberrecht">
                <p>
                  Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
                  dieser Website unterliegen dem deutschen Urheberrecht.
                  Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
                  Verwertung außerhalb der Grenzen des Urheberrechts bedürfen
                  der schriftlichen Zustimmung des jeweiligen Autors bzw.
                  Erstellers.
                </p>
                <p>
                  Downloads und Kopien dieser Seite sind nur für den privaten,
                  nicht kommerziellen Gebrauch gestattet.
                </p>
              </LegalBlock>

              <LegalBlock title="Hinweis zur Haftung">
                <p>
                  Alle Angaben auf dieser Website dienen ausschließlich der
                  Information und stellen kein vertragliches Angebot dar.
                </p>
                <p>
                  Eine Gewähr für die Richtigkeit und Vollständigkeit der
                  Informationen wird nicht übernommen. Visualisierungen dienen
                  lediglich der vorläufigen Illustration des Vorhabens;
                  Abweichungen in späteren Planungsstadien bleiben ausdrücklich
                  vorbehalten.
                </p>
                <p>
                  Alle Flächenangaben sind Circa-Angaben, Irrtümer bleiben
                  vorbehalten. Maßgeblich sind allein die vertraglichen
                  Unterlagen.
                </p>
              </LegalBlock>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
