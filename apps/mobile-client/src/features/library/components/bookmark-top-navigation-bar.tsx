import { useTranslation } from "@signet/locale/react";
import { useRouter } from "expo-router";
import { XIcon } from "phosphor-react-native/src/icons/X";
import { Platform } from "react-native";
import { TopNavigationBar } from "../../navigation/components/top-navigation-bar";
import type { TopNavigationBarAction } from "../../navigation/components/top-navigation-bar-action";

/** Bookmark modal top navigation bar properties. */
type BookmarkTopNavigationBarProps = {
  /** Translated create or edit screen title. */
  title: string;
};

export const BookmarkTopNavigationBar = ({
  title,
}: BookmarkTopNavigationBarProps) => {
  const router = useRouter();
  const { t } = useTranslation("mobile");

  const handleCancel = () => router.back();

  const cancelAction: TopNavigationBarAction = {
    accessibilityLabel: t("actions.cancel"),
    onPress: handleCancel,
    tone: "danger",
    ...(Platform.OS === "ios"
      ? { label: t("actions.cancel") }
      : { icon: XIcon }),
  };

  return <TopNavigationBar leadingAction={cancelAction} modal title={title} />;
};
