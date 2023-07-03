import React, { ReactElement } from 'react';
import { useSetAppState } from '@recoil/appState';
import SelectDropdown, { SelectDropdownProps } from 'react-native-select-dropdown';
import { Image } from 'react-native';
import { angleArrowDown, angleArrowUp } from 'assets/images';
import useStyles from './useStyles';

export type Props = SelectDropdownProps;

function DropdownPicker(props: Props): ReactElement {
  const styles = useStyles();
  const setAppState = useSetAppState();

  // -------- Callbacks --------

  const onFocus = React.useCallback(() => {
    setAppState((currVal) => ({
      ...currVal,
      noSplashScreen: true,
    }));
    if (props.onFocus) {
      props.onFocus();
    }
  }, [props, setAppState]);

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
      renderDropdownIcon={(isOpened) => (
        <Image style={styles.dropDownIcon} source={isOpened ? angleArrowUp : angleArrowDown} />
      )}
    />
  );
}

export default DropdownPicker;
