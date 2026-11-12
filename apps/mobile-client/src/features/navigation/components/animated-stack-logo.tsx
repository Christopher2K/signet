import { useNativeTheme } from "@signet/design-system/native-theme";
import { useEffect, useRef } from "react";
import { StyleSheet, Text } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

const TAB_PATH = "M0 5a5 5 0 0 1 5-5h10a5 5 0 0 1 5 5v25l-10-7-10 7z";
const SPRING_CONFIG = { damping: 18, mass: 0.7, stiffness: 180 } as const;

/** Animated Stack logo properties. */
type AnimatedStackLogoProps = {
  /** Starts the one-shot intro after the native splash hides. */
  active: boolean;
  /** Whether nonessential motion must be removed. */
  reduceMotion: boolean;
  /** Called after the identity is ready to exit. */
  onIntroComplete: () => void;
};

export const AnimatedStackLogo = ({
  active,
  reduceMotion,
  onIntroComplete,
}: AnimatedStackLogoProps) => {
  const theme = useNativeTheme();
  const started = useRef(false);
  const rearX = useSharedValue(8);
  const rearY = useSharedValue(8);
  const middleX = useSharedValue(28);
  const middleY = useSharedValue(18);
  const brandY = useSharedValue(0);
  const wordmarkOpacity = useSharedValue(0);

  const rearStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: rearX.value }, { translateY: rearY.value }],
  }));
  const middleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: middleX.value }, { translateY: middleY.value }],
  }));
  const brandStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: brandY.value }],
  }));
  const wordmarkStyle = useAnimatedStyle(() => ({
    opacity: wordmarkOpacity.value,
  }));

  useEffect(() => {
    if (!active || started.current) {
      return;
    }
    started.current = true;

    if (reduceMotion) {
      wordmarkOpacity.value = 1;
      onIntroComplete();
      return;
    }

    rearX.value = withSequence(
      withTiming(28, { duration: 180, easing: Easing.inOut(Easing.cubic) }),
      withDelay(60, withSpring(8, SPRING_CONFIG)),
    );
    rearY.value = withSequence(
      withTiming(18, { duration: 180, easing: Easing.inOut(Easing.cubic) }),
      withDelay(60, withSpring(8, SPRING_CONFIG)),
    );
    middleX.value = withSequence(
      withTiming(38, { duration: 180, easing: Easing.inOut(Easing.cubic) }),
      withSpring(28, SPRING_CONFIG),
    );
    middleY.value = withSequence(
      withTiming(23, { duration: 180, easing: Easing.inOut(Easing.cubic) }),
      withSpring(18, SPRING_CONFIG),
    );
    brandY.value = withDelay(
      180,
      withTiming(-44, { duration: 260, easing: Easing.out(Easing.cubic) }),
    );
    wordmarkOpacity.value = withDelay(
      440,
      withTiming(1, { duration: 180 }, (finished) => {
        if (finished) {
          runOnJS(onIntroComplete)();
        }
      }),
    );
  }, [
    active,
    brandY,
    middleX,
    middleY,
    onIntroComplete,
    rearX,
    rearY,
    reduceMotion,
    wordmarkOpacity,
  ]);

  return (
    <Animated.View style={[styles.brand, brandStyle]}>
      <Animated.View style={styles.logo}>
        <Animated.View style={[styles.tab, rearStyle]}>
          <Svg height={60} viewBox="0 0 20 30" width={40}>
            <Path d={TAB_PATH} fill={theme.logoBack} />
          </Svg>
        </Animated.View>
        <Animated.View style={[styles.tab, middleStyle]}>
          <Svg
            height={72}
            style={styles.outlinedTab}
            viewBox="-2 -2 24 36"
            width={48}
          >
            <Path
              d={TAB_PATH}
              fill="none"
              stroke={theme.background}
              strokeWidth={4}
            />
            <Path d={TAB_PATH} fill={theme.primary} />
          </Svg>
        </Animated.View>
        <Animated.View style={[styles.tab, styles.frontTab]}>
          <Svg
            height={72}
            style={styles.outlinedTab}
            viewBox="-2 -2 24 36"
            width={48}
          >
            <Path
              d={TAB_PATH}
              fill="none"
              stroke={theme.background}
              strokeWidth={4}
            />
            <Path d={TAB_PATH} fill={theme.accent} />
          </Svg>
        </Animated.View>
      </Animated.View>
      <Animated.View style={[styles.wordmarkContainer, wordmarkStyle]}>
        <Text style={[styles.wordmark, { color: theme.text }]}>Signet</Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  brand: {
    alignItems: "center",
    height: 96,
    width: "100%",
  },
  frontTab: {
    left: 48,
    top: 28,
  },
  logo: {
    height: 96,
    width: 96,
  },
  outlinedTab: {
    left: -4,
    position: "absolute",
    top: -4,
  },
  tab: {
    height: 60,
    position: "absolute",
    width: 40,
  },
  wordmark: {
    fontFamily: "Space Mono",
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
  },
  wordmarkContainer: {
    left: 0,
    position: "absolute",
    right: 0,
    top: 116,
  },
});
