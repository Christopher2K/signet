import {
  type BookmarkDensity,
  bookmarkDensities,
} from "@signet/core/bookmarks";
import { colors, radii, spacing } from "@signet/design-system";
import { useNativeTheme } from "@signet/design-system/native-theme";
import { useTranslation } from "@signet/locale/react";
import type { Icon } from "phosphor-react-native";
import { CardsIcon } from "phosphor-react-native/src/icons/Cards";
import { ImageIcon } from "phosphor-react-native/src/icons/Image";
import { ListBulletsIcon } from "phosphor-react-native/src/icons/ListBullets";
import { css, html } from "react-strict-dom";

/** Library density toggle properties. */
type DensityToggleProps = {
  density: BookmarkDensity;
  onChange: (density: BookmarkDensity) => void;
};

const icons: Record<BookmarkDensity, Icon> = {
  compact: ListBulletsIcon,
  medium: CardsIcon,
  big: ImageIcon,
};

/** Three-state segmented control that switches the library card density. */
export const DensityToggle = ({ density, onChange }: DensityToggleProps) => {
  const theme = useNativeTheme();
  const { t } = useTranslation("mobile");

  return (
    <html.div
      aria-label={t("library.density.label")}
      role="group"
      style={styles.group}
    >
      {bookmarkDensities.map((option) => {
        const IconComponent = icons[option];
        const selected = option === density;

        return (
          <html.button
            aria-label={t(`library.density.${option}`)}
            aria-pressed={selected}
            key={option}
            onClick={() => onChange(option)}
            style={[styles.option, selected && styles.selected]}
            type="button"
          >
            <IconComponent
              color={selected ? theme.primary : theme.textSecondary}
              size={18}
            />
          </html.button>
        );
      })}
    </html.div>
  );
};

const styles = css.create({
  group: {
    alignItems: "center",
    borderColor: colors.border,
    borderRadius: radii.md,
    borderStyle: "solid",
    borderWidth: 1,
    display: "flex",
    flexDirection: "row",
    gap: spacing[1],
    padding: spacing[1],
  },
  option: {
    alignItems: "center",
    backgroundColor: "transparent",
    borderRadius: radii.sm,
    display: "flex",
    height: 32,
    justifyContent: "center",
    padding: 0,
    width: 32,
  },
  selected: {
    backgroundColor: colors.surfaceAlt,
  },
});
