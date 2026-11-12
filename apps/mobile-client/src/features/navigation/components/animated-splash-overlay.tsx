import { useNativeTheme } from "@signet/design-system/native-theme";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  ReduceMotion,
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { AnimatedStackLogo } from "./animated-stack-logo";

/** Animated native launch overlay properties. */
type AnimatedSplashOverlayProps = {
  /** Whether the branded wordmark can render with Space Mono. */
  fontsLoaded: boolean;
  /** Whether the destination is ready beneath the overlay. */
  ready: boolean;
};

export const AnimatedSplashOverlay = ({
  fontsLoaded,
  ready,
}: AnimatedSplashOverlayProps) => {
  const theme = useNativeTheme();
  const reduceMotion = useReducedMotion();
  const [layoutReady, setLayoutReady] = useState(false);
  const [animationStarted, setAnimationStarted] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const handoffStarted = useRef(false);
  const exitStarted = useRef(false);
  const overlayOpacity = useSharedValue(1);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const handleLayout = useCallback(() => {
    setLayoutReady(true);
  }, []);
  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
  }, []);

  useEffect(() => {
    if (!layoutReady || !fontsLoaded || handoffStarted.current) {
      return;
    }
    handoffStarted.current = true;
    let mounted = true;

    const hideNativeSplash = async () => {
      await SplashScreen.hideAsync();
      if (mounted) {
        setAnimationStarted(true);
      }
    };
    void hideNativeSplash();

    return () => {
      mounted = false;
    };
  }, [fontsLoaded, layoutReady]);

  useEffect(() => {
    if (!ready || !introComplete || exitStarted.current) {
      return;
    }
    exitStarted.current = true;
    overlayOpacity.value = withTiming(
      0,
      {
        duration: reduceMotion ? 120 : 240,
        reduceMotion: ReduceMotion.Never,
      },
      (finished) => {
        if (finished) {
          runOnJS(setDismissed)(true);
        }
      },
    );
  }, [introComplete, overlayOpacity, ready, reduceMotion]);

  if (dismissed) {
    return null;
  }

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      onLayout={handleLayout}
      style={[
        styles.container,
        { backgroundColor: theme.background },
        overlayStyle,
      ]}
    >
      <AnimatedStackLogo
        active={animationStarted}
        onIntroComplete={handleIntroComplete}
        reduceMotion={reduceMotion}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
});
