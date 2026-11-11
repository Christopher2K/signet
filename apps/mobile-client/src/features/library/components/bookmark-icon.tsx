import { Path, Svg } from "react-native-svg";

/** Supported Phosphor icons used by the native library. */
export type BookmarkIconName = "bookmark" | "warning";

/** Native Phosphor icon properties. */
type BookmarkIconProps = {
  color: string;
  name: BookmarkIconName;
  size?: number;
};

const paths: Record<BookmarkIconName, string> = {
  bookmark:
    "M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.39l59.76,37.39A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32Zm0,177.61-51.76-32.39a8,8,0,0,0-8.48,0L72,209.61V48H184Z",
  warning:
    "M236.8,188.09,149.35,36.22a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.87,23.87,0,0,0,21.35,35.91H215.45A23.87,23.87,0,0,0,236.8,188.09ZM222.93,203.47a8,8,0,0,1-7.48,4.53H40.55a8,8,0,0,1-7.48-12.53L120.53,43.68a8.77,8.77,0,0,1,14.94,0l87.46,151.79A8,8,0,0,1,222.93,203.47ZM120,144V104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,180Z",
};

export const BookmarkIcon = ({ color, name, size = 24 }: BookmarkIconProps) => (
  <Svg
    accessibilityElementsHidden
    fill={color}
    height={size}
    importantForAccessibility="no"
    viewBox="0 0 256 256"
    width={size}
  >
    <Path d={paths[name]} />
  </Svg>
);
