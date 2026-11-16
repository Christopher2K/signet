import type { Icon as PhosphorIcon } from "phosphor-react-native";
import { ArrowSquareOutIcon } from "phosphor-react-native/src/icons/ArrowSquareOut";
import { BookmarkSimpleIcon } from "phosphor-react-native/src/icons/BookmarkSimple";
import { PencilSimpleIcon } from "phosphor-react-native/src/icons/PencilSimple";
import { useNativeTheme } from "../native-theme";
import type { IconName, IconProps } from "./icon.types";

export type { IconName, IconProps } from "./icon.types";

const icons: Record<IconName, PhosphorIcon> = {
  "arrow-square-out": ArrowSquareOutIcon,
  bookmark: BookmarkSimpleIcon,
  pencil: PencilSimpleIcon,
};

export const Icon = ({ color, name, size = 20 }: IconProps) => {
  const theme = useNativeTheme();
  const IconComponent = icons[name];

  return <IconComponent color={color ?? theme.text} size={size} />;
};
