import { LandingApartmentsSection } from "@/components/LandingApartmentsSection";
import { ApartmentInquirySection } from "@/components/ApartmentInquirySection";
import { LandingKiezSection } from "@/components/LandingKiezSection";
import { SeoHead } from "@/components/SeoHead";
import { SplashSection } from "@/components/SplashSection";

export default function Home() {
  return (
    <>
      <SeoHead
        title="Lola"
        description="Lola ist ein neues Wohnhaus in Berlin mit zeitgemäßen Wohnungen, markanter Straßenpräsenz und einem Kiez für den echten Alltag."
        path="/"
      />

      <div className="bg-[var(--paper)] text-[var(--ink)]">
        <SplashSection />

        <main>
          <LandingKiezSection />

          <LandingApartmentsSection />
          <ApartmentInquirySection
            showSecondaryCta={false}
            backgroundClassName="bg-white"
          />
        </main>
      </div>
    </>
  );
}
