import * as Haptics from "expo-haptics";
import { useRef } from "react";
import { Animated, type GestureResponderEvent } from "react-native";
import { ButtonBase, type ButtonProps } from "./button-base";

export type {
  ButtonProps,
  ButtonSize,
  ButtonVariant,
} from "./button-base";

const pressedScale = 0.97;

export const Button = ({
  disabled = false,
  onTouchCancel,
  onTouchEnd,
  onTouchStart,
  ...props
}: ButtonProps) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handleTouchStart: ButtonProps["onTouchStart"] = (
    event: GestureResponderEvent,
  ) => {
    onTouchStart?.(event);
    if (disabled) return;

    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(
      () => undefined,
    );
    Animated.spring(scale, {
      bounciness: 0,
      speed: 50,
      toValue: pressedScale,
      useNativeDriver: true,
    }).start();
  };

  const releasePress = () => {
    Animated.spring(scale, {
      bounciness: 4,
      speed: 40,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleTouchEnd: ButtonProps["onTouchEnd"] = (
    event: GestureResponderEvent,
  ) => {
    onTouchEnd?.(event);
    releasePress();
  };

  const handleTouchCancel: ButtonProps["onTouchCancel"] = (
    event: GestureResponderEvent,
  ) => {
    onTouchCancel?.(event);
    releasePress();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <ButtonBase
        {...props}
        disabled={disabled}
        onTouchCancel={handleTouchCancel}
        onTouchEnd={handleTouchEnd}
        onTouchStart={handleTouchStart}
      />
    </Animated.View>
  );
};
