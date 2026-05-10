import Head from "next/head";
import { LandingApartmentsSection } from "@/components/LandingApartmentsSection";
import { ApartmentInquirySection } from "@/components/ApartmentInquirySection";
import { LandingKiezSection } from "@/components/LandingKiezSection";
import { SplashSection } from "@/components/SplashSection";

export default function Home() {
  return (
    <>
      <Head>
        <title>Lola</title>
        <meta
          name="description"
          content="Lola ist ein neues Wohnhaus in Berlin mit zeitgemäßen Wohnungen, markanter Straßenpräsenz und einem Kiez für den echten Alltag."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

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
