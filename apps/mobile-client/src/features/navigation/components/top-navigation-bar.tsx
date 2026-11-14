import {
  nativeFontFamily,
  nativeSpacing,
  useNativeTheme,
} from "@signet/design-system/native-theme";
import { Platform, StyleSheet, Text, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  type SharedValue,
  useAnimatedStyle,
  useReducedMotion,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  type TopNavigationBarAction,
  TopNavigationBarActionButton,
} from "./top-navigation-bar-action";

const compactBarHeight = Platform.OS === "ios" ? 44 : 56;
const expandedBarHeight = 92;
const actionTargetSize = Platform.OS === "ios" ? 44 : 48;
const modalBarHeight = 60;
const slotGap = Platform.OS === "ios" ? nativeSpacing[2] : nativeSpacing[1];
const collapseDistance = expandedBarHeight - 44;
const collapseThreshold = collapseDistance / 2;

/** Custom native top navigation bar properties. */
type TopNavigationBarProps = {
  /** Translated screen title. */
  title: string;
  /** Optional back, dismissal, or other leading action. */
  leadingAction?: TopNavigationBarAction;
  /** Up to two trailing actions, displayed in declaration order. */
  trailingActions?: readonly TopNavigationBarAction[];
  /** Uses the iOS expanded title treatment; Android remains compact. */
  largeTitle?: boolean;
  /** Uses additional vertical room inside an iOS modal sheet. */
  modal?: boolean;
  /** Vertical content offset used to collapse an iOS large title. */
  scrollY?: SharedValue<number>;
};

export const TopNavigationBar = ({
  title,
  leadingAction,
  trailingActions = [],
  largeTitle = false,
  modal = false,
  scrollY,
}: TopNavigationBarProps) => {
  const theme = useNativeTheme();
  const reduceMotion = useReducedMotion();
  const expandedLargeTitle = largeTitle && Platform.OS === "ios";
  const barHeight =
    modal && Platform.OS === "ios" ? modalBarHeight : compactBarHeight;

  const animatedBarStyle = useAnimatedStyle(() => {
    if (!expandedLargeTitle || !scrollY) {
      return { height: barHeight };
    }

    const progress = reduceMotion
      ? scrollY.value >= collapseThreshold
        ? 1
        : 0
      : interpolate(
          scrollY.value,
          [0, collapseDistance],
          [0, 1],
          Extrapolation.CLAMP,
        );

    return {
      height: expandedBarHeight - collapseDistance * progress,
    };
  }, [barHeight, expandedLargeTitle, reduceMotion, scrollY]);

  const animatedCompactTitleStyle = useAnimatedStyle(
    () => ({
      opacity:
        expandedLargeTitle && (!scrollY || scrollY.value < collapseThreshold)
          ? 0
          : 1,
    }),
    [expandedLargeTitle, scrollY],
  );

  const animatedLargeTitleStyle = useAnimatedStyle(
    () => ({
      opacity: scrollY && scrollY.value >= collapseThreshold ? 0 : 1,
    }),
    [scrollY],
  );

  return (
    <SafeAreaView edges={["top"]} style={{ backgroundColor: theme.surface }}>
      <Animated.View
        style={[
          styles.bar,
          {
            backgroundColor: theme.surface,
            borderBottomColor: theme.border,
          },
          animatedBarStyle,
        ]}
      >
        <View
          style={[
            styles.compactRow,
            { height: barHeight },
            modal && Platform.OS === "ios" && styles.iosModalCompactRow,
          ]}
        >
          <View
            style={[
              styles.side,
              styles.leadingSide,
              Platform.OS === "ios" && styles.flexSide,
              Platform.OS === "android" &&
                leadingAction &&
                styles.androidLeadingSide,
            ]}
          >
            {leadingAction ? (
              <TopNavigationBarActionButton
                action={leadingAction}
                size={actionTargetSize}
              />
            ) : null}
          </View>
          <Animated.View
            style={[
              styles.titleContainer,
              animatedCompactTitleStyle,
              Platform.OS === "android" &&
                !leadingAction &&
                styles.androidTitleWithoutLeadingAction,
            ]}
          >
            <Text
              accessibilityRole="header"
              ellipsizeMode="tail"
              numberOfLines={1}
              style={[
                styles.title,
                { color: theme.text, fontFamily: nativeFontFamily },
              ]}
            >
              {title}
            </Text>
          </Animated.View>
          <View
            style={[
              styles.side,
              styles.trailingSide,
              Platform.OS === "ios" && styles.flexSide,
            ]}
          >
            {trailingActions.map((action) => (
              <TopNavigationBarActionButton
                action={action}
                key={action.accessibilityLabel}
                size={actionTargetSize}
              />
            ))}
          </View>
        </View>
        {expandedLargeTitle ? (
          <Animated.View
            accessibilityElementsHidden
            accessible={false}
            importantForAccessibility="no-hide-descendants"
            pointerEvents="none"
            style={[styles.largeTitleContainer, animatedLargeTitleStyle]}
          >
            <Text
              ellipsizeMode="tail"
              numberOfLines={1}
              style={[
                styles.largeTitle,
                { color: theme.text, fontFamily: nativeFontFamily },
              ]}
            >
              {title}
            </Text>
          </Animated.View>
        ) : null}
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  bar: {
    borderBottomWidth: 1,
    overflow: "hidden",
  },
  compactRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: slotGap,
    left: 0,
    paddingHorizontal: nativeSpacing[2],
    position: "absolute",
    right: 0,
    top: 0,
  },
  iosModalCompactRow: {
    paddingHorizontal: nativeSpacing[4],
  },
  side: {
    alignItems: "center",
    flexDirection: "row",
    gap: slotGap,
    height: "100%",
  },
  flexSide: {
    flex: 1,
  },
  leadingSide: {
    justifyContent: "flex-start",
  },
  androidLeadingSide: {
    width: actionTargetSize,
  },
  trailingSide: {
    justifyContent: "flex-end",
  },
  titleContainer: Platform.select({
    android: {
      alignItems: "flex-start",
      flex: 1,
    },
    default: {
      alignItems: "center",
      flexShrink: 1,
      maxWidth: 270,
    },
  }),
  androidTitleWithoutLeadingAction: {
    marginLeft: nativeSpacing[1],
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 26,
  },
  largeTitleContainer: {
    bottom: nativeSpacing[1],
    left: nativeSpacing[4],
    position: "absolute",
    right: nativeSpacing[4],
  },
  largeTitle: {
    fontSize: 32,
    fontWeight: "700",
    lineHeight: 41.6,
  },
});
