import type { Icon } from "phosphor-react-native";
import { BookmarkSimpleIcon } from "phosphor-react-native/src/icons/BookmarkSimple";
import { WarningIcon } from "phosphor-react-native/src/icons/Warning";

/** Supported Phosphor icons used by the native library. */
export type BookmarkIconName = "bookmark" | "warning";

/** Native Phosphor icon properties. */
type BookmarkIconProps = {
  color: string;
  name: BookmarkIconName;
  size?: number;
};

const icons: Record<BookmarkIconName, Icon> = {
  bookmark: BookmarkSimpleIcon,
  warning: WarningIcon,
};

export const BookmarkIcon = ({ color, name, size = 24 }: BookmarkIconProps) => {
  const IconComponent = icons[name];

  return <IconComponent color={color} size={size} />;
};
