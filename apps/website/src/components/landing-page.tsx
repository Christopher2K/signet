import { colors, typography } from "@signet/design-system/tokens.css";
import { css, html } from "react-strict-dom";
import { FeatureGrid } from "#/components/feature-grid";
import { FinalCta } from "#/components/final-cta";
import { Hero } from "#/components/hero";
import { HowItWorks } from "#/components/how-it-works";
import { LibraryPreview } from "#/components/library-preview";
import { PlatformStrip } from "#/components/platform-strip";
import { SelfHost } from "#/components/self-host";
import { SiteFooter } from "#/components/site-footer";
import { SiteHeader } from "#/components/site-header";
import { webTheme } from "#/web-theme.css";

export const LandingPage = () => {
  return (
    <html.div
      data-layoutconformance="strict"
      style={[webTheme as unknown as typeof styles.app, styles.app]}
    >
      <SiteHeader />
      <html.main>
        <Hero />
        <LibraryPreview />
        <PlatformStrip />
        <FeatureGrid />
        <HowItWorks />
        <SelfHost />
        <FinalCta />
      </html.main>
      <SiteFooter />
    </html.div>
  );
};

const styles = css.create({
  app: {
    minHeight: "100vh",
    color: colors.text,
    backgroundColor: colors.background,
    fontFamily: typography.fontFamily,
    fontSize: typography.bodySize,
    lineHeight: 1.65,
  },
});
