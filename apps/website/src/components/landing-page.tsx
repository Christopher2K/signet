import { FeatureGrid } from "#/components/feature-grid";
import { FinalCta } from "#/components/final-cta";
import { Hero } from "#/components/hero";
import { HowItWorks } from "#/components/how-it-works";
import { LibraryPreview } from "#/components/library-preview";
import { PlatformStrip } from "#/components/platform-strip";
import { SelfHost } from "#/components/self-host";
import { SiteFooter } from "#/components/site-footer";
import { SiteHeader } from "#/components/site-header";

export const LandingPage = () => {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <LibraryPreview />
        <PlatformStrip />
        <FeatureGrid />
        <HowItWorks />
        <SelfHost />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
};
