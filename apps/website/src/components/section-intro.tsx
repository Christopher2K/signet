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
    <div className="section-intro">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p className="section-description">{description}</p>
    </div>
  );
};
