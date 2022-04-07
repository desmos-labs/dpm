import React, { useRef } from 'react';
import { Pressable, View, Animated } from 'react-native';
import { useTheme } from 'react-native-paper';

type SwitchProps = {
  onPress?: () => void;
  isActive: boolean;
  isDisabled: boolean;
};
// eslint-disable-next-line import/prefer-default-export
export const Switch: React.FC<SwitchProps> = (props) => {
  const { onPress, isActive, isDisabled } = props;
  const [active, setActive] = React.useState(isActive);
  const theme = useTheme();
  const translation = useRef(new Animated.Value(active ? 7 : -7)).current;

  const animateToggle = () => {
    Animated.spring(translation, {
      toValue: active ? -7 : 7,
      useNativeDriver: true,
    }).start();
    setActive(!active);
  };

  return (
    <Pressable
      disabled={isDisabled}
      style={[{ paddingVertical: 6 }, isDisabled ? { opacity: 0.3 } : null]}
      onPress={() => {
        animateToggle();
        if (onPress) {
          onPress();
        }
      }}
    >
      <Animated.View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Animated.View
          style={{
            width: 26,
            height: 4,
            borderRadius: 1,
            backgroundColor: active ? theme.colors.toggle.active : theme.colors.toggle.inactive,
          }}
        />
        <Animated.View
          style={{
            width: 12,
            position: 'absolute',
            height: 12,
            borderRadius: 2,
            backgroundColor: active ? theme.colors.toggle.active : theme.colors.toggle.inactive,
            transform: [{ translateX: translation }],
          }}
        />
      </Animated.View>
    </Pressable>
  );
};
