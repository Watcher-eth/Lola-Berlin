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
              <LegalBlock title="Anbieterin">
                <p>
                  ImmoFriends GmbH
                  <br />
                  Holsteinische Straße 18
                  <br />
                  10717 Berlin
                  <br />
                  Deutschland
                </p>
              </LegalBlock>

              <LegalBlock title="Kontakt">
                <p>
                  E-Mail:{" "}
                  <a
                    href="mailto:hello@lola.berlin"
                    className="text-[#3f422d] underline decoration-[#3f422d]/30 underline-offset-4"
                  >
                    hello@lola.berlin
                  </a>
                </p>
                <p>Telefon: wird vor Veröffentlichung ergänzt.</p>
              </LegalBlock>

              <LegalBlock title="Vertretung und Register">
                <p>
                  Vertretungsberechtigte Geschäftsführung: wird vor
                  Veröffentlichung ergänzt.
                </p>
                <p>
                  Registergericht und Handelsregisternummer: wird vor
                  Veröffentlichung ergänzt.
                </p>
                <p>Umsatzsteuer-ID: wird ergänzt, sofern vorhanden.</p>
              </LegalBlock>

              <LegalBlock title="Projekt">
                <p>
                  Diese Website informiert über das Mietwohnprojekt LOLA in der
                  Holsteinischen Straße 18 in Berlin-Wilmersdorf.
                </p>
              </LegalBlock>

              <LegalBlock title="Hinweis">
                <p>
                  Die Angaben auf dieser Seite sind für den Livegang mit den
                  finalen Register-, Kontakt- und Vertretungsdaten der
                  ImmoFriends GmbH abzugleichen.
                </p>
              </LegalBlock>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
