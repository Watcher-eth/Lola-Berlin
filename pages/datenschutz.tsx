import type { ReactNode } from "react";
import { SeoHead } from "@/components/SeoHead";
import { SiteHeader } from "@/components/SiteHeader";

function PrivacySection({
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

export default function DatenschutzPage() {
  return (
    <>
      <SeoHead
        title="Datenschutz"
        description="Datenschutzhinweise der LOLA Website für das Wohnprojekt Holsteinische Straße 18."
        path="/datenschutz"
      />
      <div className="min-h-screen bg-[#f7f3ea] text-[#171713]">
        <div className="relative min-h-[108px] bg-[#f7f3ea] md:min-h-[124px]">
          <SiteHeader theme="paper" />
        </div>
        <main className="px-6 py-16 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-4xl">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#8a4432]">
              DSGVO
            </p>
            <h1 className="mt-5 font-serif text-5xl leading-none tracking-[-0.05em] text-[#3f422d] sm:text-7xl">
              Datenschutz
            </h1>

            <div className="mt-10 space-y-10">
              <PrivacySection title="Verantwortliche Stelle">
                <p>
                  Verantwortlich für die Datenverarbeitung auf dieser Website
                  ist:
                </p>
                <p>
                  AFG IA GmbH &amp; Co. KG
                  <br />
                  Holsteinische Straße 18
                  <br />
                  10717 Berlin
                  <br />
                  Deutschland
                </p>
                <p>
                  E-Mail:{" "}
                  <a
                    href="mailto:LOLA@jeremyzimmer-immobilien.de"
                    className="text-[#3f422d] underline decoration-[#3f422d]/30 underline-offset-4"
                  >
                    LOLA@jeremyzimmer-immobilien.de
                  </a>
                </p>
              </PrivacySection>

              <PrivacySection title="Zweck dieser Website">
                <p>
                  Diese Website informiert über das Mietwohnprojekt LOLA in der
                  Holsteinischen Straße 18 in Berlin-Wilmersdorf. Sie zeigt
                  Wohnungen, Grundrisse, Wohnqualitäten und Kontaktmöglichkeiten
                  für Mietinteressentinnen und Mietinteressenten.
                </p>
              </PrivacySection>

              <PrivacySection title="Server-Logfiles und Hosting">
                <p>
                  Beim Aufruf der Website werden technisch erforderliche Daten
                  verarbeitet, etwa IP-Adresse, Datum und Uhrzeit des Zugriffs,
                  aufgerufene Seiten, Browser-/Geräteinformationen,
                  Referrer-URL und übertragene Datenmenge. Diese Verarbeitung
                  ist erforderlich, um die Website sicher, stabil und
                  funktionsfähig auszuliefern.
                </p>
                <p>
                  Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Das
                  berechtigte Interesse liegt im sicheren und zuverlässigen
                  Betrieb der Website.
                </p>
                <p>
                  Die Website kann über Vercel gehostet und über
                  Infrastruktur- oder Sicherheitsdienste wie Cloudflare
                  ausgeliefert werden. Soweit solche Anbieter eingesetzt
                  werden, erfolgt die Verarbeitung auf Grundlage geeigneter
                  Verträge zur Auftragsverarbeitung.
                </p>
              </PrivacySection>

              <PrivacySection title="Kontaktformular">
                <p>
                  Wenn Sie über das Kontaktformular eine Anfrage senden,
                  verarbeiten wir die von Ihnen eingegebenen Daten: Name,
                  E-Mail-Adresse, gewünschte Wohnungsgröße oder Zimmerzahl,
                  freie Nachricht sowie, bei einer konkreten Wohnungsanfrage,
                  Angaben zur ausgewählten Wohnung, Etage und zum Grundrisstyp.
                </p>
                <p>
                  Die Daten werden ausschließlich verwendet, um Ihre Anfrage zum
                  Wohnprojekt, zur Verfügbarkeit, zu Grundrissen oder zu
                  Besichtigung und weiterer Kommunikation zu bearbeiten.
                </p>
                <p>
                  Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit Ihre
                  Anfrage auf die Anbahnung eines Mietverhältnisses gerichtet
                  ist, und ergänzend Art. 6 Abs. 1 lit. f DSGVO für die
                  strukturierte Bearbeitung allgemeiner Projektanfragen.
                </p>
                <p>
                  Die Anfrage wird per E-Mail an die zuständige Kontaktadresse
                  weitergeleitet. Eine Weitergabe an Dritte erfolgt nur, wenn
                  sie zur Bearbeitung Ihrer Anfrage erforderlich ist, eine
                  gesetzliche Pflicht besteht oder Sie eingewilligt haben.
                </p>
              </PrivacySection>

              <PrivacySection title="Bewerbungs- und Bonitätsunterlagen">
                <p>
                  Über diese Website werden derzeit keine SCHUFA-Auskünfte,
                  Einkommensnachweise, Ausweiskopien oder sonstige
                  Bewerbungsunterlagen hochgeladen. Solche Unterlagen sollten
                  nicht über das freie Nachrichtenfeld übermittelt werden.
                </p>
                <p>
                  Falls zu einem späteren Zeitpunkt Bewerbungsunterlagen oder
                  Wartelisten verarbeitet werden, werden hierfür gesonderte
                  Hinweise und geeignete technische Abläufe bereitgestellt.
                </p>
              </PrivacySection>

              <PrivacySection title="Speicherdauer">
                <p>
                  Kontaktanfragen werden nur so lange gespeichert, wie dies zur
                  Bearbeitung der Anfrage und etwaiger Anschlusskommunikation
                  erforderlich ist. Gesetzliche Aufbewahrungspflichten bleiben
                  unberührt.
                </p>
              </PrivacySection>

              <PrivacySection title="Cookies, Analyse und Marketing">
                <p>
                  Diese Website verwendet derzeit keine einwilligungspflichtigen
                  Analyse- oder Marketing-Cookies, kein Google Analytics, kein
                  Meta Pixel und kein Retargeting.
                </p>
                <p>
                  Die Auswahl im Cookie-Banner wird lokal im Browser
                  gespeichert, damit der Hinweis nicht bei jedem Seitenaufruf
                  erneut erscheint. Je nach Browser erfolgt dies per Local
                  Storage oder als technisch notwendiges Consent-Cookie.
                </p>
                <p>
                  Sollte künftig Tracking, Marketing, externe Karten,
                  eingebettete Medien oder vergleichbare Drittanbieter-Technik
                  eingesetzt werden, wird dies erst nach entsprechender
                  Information und, soweit erforderlich, nach Einwilligung über
                  ein Consent-Management aktiviert.
                </p>
              </PrivacySection>

              <PrivacySection title="Schriftarten, Bilder und Grundrisse">
                <p>
                  Die verwendeten Schriftarten und Projektbilder werden lokal
                  über diese Website ausgeliefert. Grundrisse werden ebenfalls
                  als statische SVG-Projektunterlagen bereitgestellt und lösen
                  keine eigene Profilbildung aus.
                </p>
              </PrivacySection>

              <PrivacySection title="Ihre Rechte">
                <p>
                  Sie haben im Rahmen der gesetzlichen Voraussetzungen das Recht
                  auf Auskunft, Berichtigung, Löschung, Einschränkung der
                  Verarbeitung, Datenübertragbarkeit sowie Widerspruch gegen
                  Verarbeitungen auf Grundlage berechtigter Interessen.
                </p>
                <p>
                  Sie haben außerdem das Recht, sich bei einer
                  Datenschutzaufsichtsbehörde zu beschweren, insbesondere bei
                  der für Berlin zuständigen Aufsichtsbehörde.
                </p>
              </PrivacySection>

              <PrivacySection title="Stand">
                <p>
                  Stand dieser Datenschutzhinweise: Mai 2026. Die Angaben sind
                  vor Veröffentlichung mit den finalen Hosting-, Register-,
                  Kontakt- und Dienstleisterdaten abzugleichen.
                </p>
              </PrivacySection>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
