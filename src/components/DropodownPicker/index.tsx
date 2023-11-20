import React, { ReactElement } from 'react';
import { useSetAppState } from '@recoil/appState';
import SelectDropdown, { SelectDropdownProps } from 'react-native-select-dropdown';
import { angleArrowDown } from 'assets/images';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import useStyles from './useStyles';

type Props = SelectDropdownProps;

function DropdownPicker(props: Props): ReactElement {
  const styles = useStyles();
  const setAppState = useSetAppState();

  // -------- Variables --------

  const arrowRotation = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${arrowRotation.value}deg`,
      },
    ],
  }));

  // -------- Callbacks --------

  const startAnimation = React.useCallback(
    (isOpen: boolean) => {
      arrowRotation.value = withTiming(isOpen ? 180 : 0, {
        duration: 200,
      });
    },
    [arrowRotation],
  );

  const onFocus = React.useCallback(() => {
    startAnimation(true);
    setAppState((currVal) => ({
      ...currVal,
      noSplashScreen: true,
    }));
    if (props.onFocus) {
      props.onFocus();
    }
  }, [props, setAppState, startAnimation]);

  const onBlur = React.useCallback(() => {
    startAnimation(false);
    if (props.onBlur) {
      props.onBlur();
    }
  }, [props, startAnimation]);

  return (
    <SelectDropdown
      {...props}
      buttonStyle={styles.root}
      buttonTextStyle={styles.selectText}
      dropdownStyle={styles.dropdown}
      dropdownOverlayColor={'transparent'}
      statusBarTranslucent={false}
      rowStyle={styles.rowStyle}
      rowTextStyle={styles.selectText}
      onFocus={onFocus}
      onBlur={onBlur}
      renderDropdownIcon={() => (
        <Animated.Image style={[styles.dropDownIcon, animatedStyle]} source={angleArrowDown} />
      )}
    />
  );
}

export default DropdownPicker;
