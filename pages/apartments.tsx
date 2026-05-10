import Head from "next/head";
import { ApartmentFeaturesSection } from "@/components/ApartmentFeaturesSection";
import { ApartmentsExplorer } from "@/components/ApartmentsExplorer";
import { ApartmentInquirySection } from "@/components/ApartmentInquirySection";
import { ApartmentRenderGallery } from "@/components/ApartmentRenderGallery";
import { SiteHeader } from "@/components/SiteHeader";

export default function ApartmentsPage() {
  return (
    <>
      <Head>
        <title>Wohnungen | Lola</title>
        <meta
          name="description"
          content="Wohnungen in Lola: interaktive Grundrissübersicht, exemplarische Verfügbarkeiten und Einblick in die Wohnungsqualitäten des Hauses."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="bg-[#f7f3eb] text-[var(--ink)]">
        <div className="relative min-h-[108px] bg-[#f7f3eb] md:min-h-[124px]">
          <SiteHeader theme="paper" />
        </div>

        <main>
          <ApartmentsExplorer />
          <ApartmentFeaturesSection />
          <ApartmentRenderGallery />
          <ApartmentInquirySection />
        </main>
      </div>
    </>
  );
}
