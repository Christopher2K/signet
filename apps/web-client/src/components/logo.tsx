import { css, html } from "react-strict-dom";

/** Signet Stack mark properties. */
export type LogoProps = {
  /** Rendered size in CSS pixels. */
  size?: number;
};

const getOpticalMaster = (size: number) => {
  if (size <= 16) {
    return 16;
  }
  if (size <= 24) {
    return 24;
  }
  return size <= 40 ? 32 : 48;
};

/** Signet Stack mark using the optical master for its rendered size. */
export const Logo = ({ size = 32 }: LogoProps) => {
  const master = getOpticalMaster(size);

  return (
    <html.img
      alt=""
      aria-hidden={true}
      height={size}
      src={`/logo-${master}.svg`}
      style={styles.mark}
      width={size}
    />
  );
};

const styles = css.create({
  mark: {
    display: "block",
    flexShrink: 0,
  },
});
