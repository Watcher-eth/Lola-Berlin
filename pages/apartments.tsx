import { ApartmentFeaturesSection } from "@/components/ApartmentFeaturesSection";
import { ApartmentsExplorer } from "@/components/ApartmentsExplorer";
import { ApartmentInquirySection } from "@/components/ApartmentInquirySection";
import { ApartmentRenderGallery } from "@/components/ApartmentRenderGallery";
import { SeoHead } from "@/components/SeoHead";
import { SiteHeader } from "@/components/SiteHeader";

export default function ApartmentsPage() {
  return (
    <>
      <SeoHead
        title="Wohnungen"
        description="Wohnungen in Lola: interaktive Grundrissübersicht, exemplarische Verfügbarkeiten und Einblick in die Wohnungsqualitäten des Hauses."
        path="/apartments"
      />

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
