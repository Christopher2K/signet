import { Typography } from "@signet/design-system";
import { spacing } from "@signet/design-system/tokens.css";
import { css, html } from "react-strict-dom";
import { Eyebrow } from "#/components/eyebrow";

/** Section introduction properties. */
type SectionIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

/** Shared editorial heading for landing-page sections. */
export const SectionIntro = ({
  eyebrow,
  title,
  description,
}: SectionIntroProps) => {
  return (
    <html.div style={styles.container}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <Typography as="h2" variant="headline" style={styles.title}>
        {title}
      </Typography>
      <Typography as="p" tone="secondary">
        {description}
      </Typography>
    </html.div>
  );
};

const styles = css.create({
  container: {
    display: "flex",
    maxWidth: 900,
    flexDirection: "column",
    alignItems: "flex-start",
    gap: spacing[4],
    marginBottom: spacing[12],
  },
  title: {
    fontWeight: "700",
    lineHeight: 1.25,
    letterSpacing: "-0.03em",
    "@media (max-width: 760px)": {
      fontSize: 28,
    },
  },
});
