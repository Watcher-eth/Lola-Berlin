import type { ReactNode } from "react";
import { SeoHead } from "@/components/SeoHead";
import { SiteHeader } from "@/components/SiteHeader";

function CookieSection({
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
      <div className="mt-4 space-y-4 text-base leading-8 text-[#171713]/74">
        {children}
      </div>
    </section>
  );
}

export default function CookiesPage() {
  return (
    <>
      <SeoHead
        title="Cookies"
        description="Cookie-Hinweise der LOLA Website."
        path="/cookies"
      />
      <div className="min-h-screen bg-[#f7f3ea] text-[#171713]">
        <div className="relative min-h-[108px] bg-[#f7f3ea] md:min-h-[124px]">
          <SiteHeader theme="paper" />
        </div>
        <main className="px-6 py-16 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-4xl">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#8a4432]">
              Cookies und Consent
            </p>
            <h1 className="mt-5 font-serif text-5xl leading-none tracking-[-0.05em] text-[#3f422d] sm:text-7xl">
              Cookies
            </h1>

            <div className="mt-10 space-y-10">
              <CookieSection title="Aktueller Einsatz">
                <p>
                  Diese Website verwendet derzeit keine
                  einwilligungspflichtigen Analyse-, Marketing- oder
                  Retargeting-Cookies. Es werden aktuell kein Google Analytics,
                  kein Meta Pixel und keine vergleichbare Tracking-Technik
                  aktiviert.
                </p>
              </CookieSection>

              <CookieSection title="Cookie-Banner und Auswahl">
                <p>
                  Beim ersten Besuch zeigt diese Website einen Cookie-Hinweis.
                  Dort können Sie entweder nur technisch notwendige Funktionen
                  zulassen oder alle künftig angebotenen Cookie-Kategorien
                  akzeptieren.
                </p>
                <p>
                  Die Auswahl wird lokal im Browser gespeichert, damit der
                  Hinweis nicht bei jedem Seitenaufruf erneut erscheint. Je nach
                  Browser kann dies per Local Storage oder als technisch
                  notwendiges Consent-Cookie erfolgen.
                </p>
              </CookieSection>

              <CookieSection title="Technisch erforderliche Verarbeitung">
                <p>
                  Technisch notwendige Vorgänge können erforderlich sein, damit
                  die Website sicher, stabil und in der gewünschten Sprache und
                  Darstellung ausgeliefert wird. Diese Vorgänge dienen nicht der
                  Werbung oder Profilbildung.
                </p>
              </CookieSection>

              <CookieSection title="Änderungen">
                <p>
                  Falls künftig Analyse, Marketing, externe Karten, eingebettete
                  Medien oder Retargeting eingesetzt werden, wird die Website
                  vorab um eine entsprechende Consent-Lösung und aktualisierte
                  Datenschutzhinweise ergänzt.
                </p>
              </CookieSection>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
