import { spacing, Typography } from "@signet/design-system";
import {
  nativeSpacing,
  useNativeTheme,
} from "@signet/design-system/native-theme";
import { Platform, StyleSheet } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  type SharedValue,
  useAnimatedStyle,
  useReducedMotion,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { css, html } from "react-strict-dom";
import {
  type TopNavigationBarAction,
  TopNavigationBarActionButton,
} from "./top-navigation-bar-action";

const compactBarHeight = Platform.OS === "ios" ? 44 : 56;
const expandedBarHeight = 92;
const actionTargetSize = Platform.OS === "ios" ? 44 : 48;
const modalBarHeight = 60;
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
          nativeStyles.bar,
          {
            backgroundColor: theme.surface,
            borderBottomColor: theme.border,
          },
          animatedBarStyle,
        ]}
      >
        <html.div
          style={[
            styles.compactRow(barHeight),
            modal && Platform.OS === "ios" && styles.iosModalCompactRow,
          ]}
        >
          <html.div
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
          </html.div>
          <Animated.View
            style={[
              nativeStyles.titleContainer,
              animatedCompactTitleStyle,
              Platform.OS === "android" &&
                !leadingAction &&
                nativeStyles.androidTitleWithoutLeadingAction,
            ]}
          >
            <Typography as="h1" style={styles.title} variant="title">
              {title}
            </Typography>
          </Animated.View>
          <html.div
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
          </html.div>
        </html.div>
        {expandedLargeTitle ? (
          <Animated.View
            accessibilityElementsHidden
            accessible={false}
            importantForAccessibility="no-hide-descendants"
            pointerEvents="none"
            style={[nativeStyles.largeTitleContainer, animatedLargeTitleStyle]}
          >
            <Typography as="h1" style={styles.largeTitle} variant="headline">
              {title}
            </Typography>
          </Animated.View>
        ) : null}
      </Animated.View>
    </SafeAreaView>
  );
};

const nativeStyles = StyleSheet.create({
  bar: {
    borderBottomWidth: 1,
    overflow: "hidden",
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
  largeTitleContainer: {
    bottom: nativeSpacing[1],
    left: nativeSpacing[4],
    position: "absolute",
    right: nativeSpacing[4],
  },
});

const styles = css.create({
  compactRow: (height) => ({
    alignItems: "center",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "row",
    gap: Platform.OS === "ios" ? spacing[2] : spacing[1],
    height,
    left: 0,
    paddingInline: spacing[2],
    position: "absolute",
    right: 0,
    top: 0,
  }),
  iosModalCompactRow: {
    boxSizing: "border-box",
    paddingInline: spacing[4],
  },
  side: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    gap: Platform.OS === "ios" ? spacing[2] : spacing[1],
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
  title: {
    lineClamp: 1,
    lineHeight: 1.3,
  },
  largeTitle: {
    lineClamp: 1,
    lineHeight: 1.3,
  },
});
