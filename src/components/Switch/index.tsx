import React, { useCallback, useEffect, useRef } from 'react';
import { Animated, TouchableOpacity } from 'react-native';
import useStyles from './useStyles';

type SwitchProps = {
  /** The initial value of the switch. You can dynamically pass a value to change the position of the switch */
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
  const translation = useRef(new Animated.Value(active ? 7 : -7)).current;
  const styles = useStyles(isDisabled, active, translation);

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
      style={styles.opacity}
      onPress={() => {
        if (animateOnPress) animateToggle();
        if (onPress) onPress();
      }}
    >
      <Animated.View style={styles.button}>
        <Animated.View style={styles.square} />
        <Animated.View style={styles.line} />
      </Animated.View>
    </TouchableOpacity>
  );
};

export default Switch;
