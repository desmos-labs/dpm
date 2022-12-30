import React, { useCallback, useEffect, useRef } from 'react';
import { Animated, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';

type SwitchProps = {
  /** The initial value of the switch. You can dinamically pass a value to change the position of the switch */
  value: boolean;
  /** Indicates if the switch is enabled or disabled */
  isDisabled: boolean;
  /** The callback you want to run when pressing the switch */
  onPress?: () => void;
  /** If you want to animate the switch when executing the callback */
  animateOnPress?: boolean;
};

const Switch: React.FC<SwitchProps> = (props) => {
  const { onPress, value, isDisabled, animateOnPress } = props;
  const [active, setActive] = React.useState(value);
  const theme = useTheme();
  const translation = useRef(new Animated.Value(active ? 7 : -7)).current;

  const animateToggle = useCallback(() => {
    Animated.spring(translation, {
      toValue: active ? -7 : 7,
      useNativeDriver: true,
    }).start();
    setActive(!active);
  }, [active, translation]);

  useEffect(() => {
    if (value !== active) {
      animateToggle();
    }
  }, [active, animateToggle, value]);

  return (
    <TouchableOpacity
      disabled={isDisabled}
      style={[{ padding: 8, marginLeft: 6 }, isDisabled ? { opacity: 0.3 } : null]}
      onPress={() => {
        if (animateOnPress) animateToggle();
        if (onPress) onPress();
      }}
    >
      <Animated.View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Animated.View
          style={{
            width: 28,
            height: 4,
            borderRadius: 1,
            backgroundColor: active ? theme.colors.toggle.active : theme.colors.toggle.inactive,
          }}
        />
        <Animated.View
          style={{
            width: 14,
            position: 'absolute',
            height: 14,
            borderRadius: 2,
            backgroundColor: active ? theme.colors.toggle.active : theme.colors.toggle.inactive,
            transform: [{ translateX: translation }],
          }}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

export default Switch;
