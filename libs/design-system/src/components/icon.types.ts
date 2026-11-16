/** Phosphor icons rendered by shared components. */
export type IconName = "arrow-square-out" | "bookmark" | "pencil";

/** Cross-platform icon properties. */
export type IconProps = {
  /** Icon color, defaulting to the current text color. */
  color?: string;
  /** Phosphor icon name. */
  name: IconName;
  /** Square size in pixels, defaulting to 20. */
  size?: number;
};
