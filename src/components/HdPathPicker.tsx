import React, { useEffect, useState } from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { makeStyleWithProps } from '../theming';
import { DESMOS_COIN_TYPE, HdPath } from '../types/hdpath';
import { Typography } from './Typography';
import { TextInput } from './TextInput';

export type HdPathPickerProps = {
  /**
   * Function called when the HDPath changes.
   */
  onChange?: (path: HdPath) => void;
  /**
   * The component value
   */
  value?: HdPath;
  /**
   * True to make the component read only.
   */
  disabled?: boolean;
  /**
   * True to allow the editing of the coin type value.
   */
  allowCoinTypeEdit?: boolean;
  style?: StyleProp<ViewStyle>;
};

const safeParseInt = (value: string) => {
  const number = parseInt(value, 10);
  if (Number.isNaN(number)) {
    return 0;
  }
  return number;
};

export const HdPathPicker: React.FC<HdPathPickerProps> = (props) => {
  const { onChange, value, disabled, allowCoinTypeEdit, style, children } = props;
  const styles = useStyle(props);
  const [hdPath, setHdPath] = useState<HdPath>(
    value ?? {
      coinType: DESMOS_COIN_TYPE,
      account: 0,
      change: 0,
      addressIndex: 0,
    }
  );

  useEffect(() => {
    if (value !== undefined) {
      setHdPath(value);
    }
  }, [value]);

  const onElementChange = (changedValue: string, changedElement: keyof HdPath) => {
    let newHdPath = hdPath;
    // eslint-disable-next-line default-case
    switch (changedElement) {
      case 'coinType': {
        newHdPath = {
          ...hdPath,
          coinType: safeParseInt(changedValue),
        };
        break;
      }
      case 'account':
        newHdPath = {
          ...hdPath,
          account: safeParseInt(changedValue),
        };
        break;
      case 'change':
        newHdPath = {
          ...hdPath,
          change: safeParseInt(changedValue),
        };
        break;
      case 'addressIndex':
        newHdPath = {
          ...hdPath,
          addressIndex: safeParseInt(changedValue),
        };
        break;
    }
    setHdPath(newHdPath);
    if (onChange !== undefined) {
      onChange(newHdPath);
    }
  };

  return (
    <View style={StyleSheet.compose(styles.root as StyleProp<ViewStyle>, style)}>
      {allowCoinTypeEdit === true ? (
        <>
          <Typography.Body1 style={styles.hdPathText}>m/44&#39;/</Typography.Body1>
          <TextInput
            style={styles.elements}
            inputStyle={styles.input}
            keyboardType="numeric"
            onChangeText={(v) => onElementChange(v, 'coinType')}
            value={hdPath.coinType.toString()}
            editable={disabled !== true}
          />
          <Text style={styles.hdPathText}>/</Text>
        </>
      ) : (
        <Typography.Body1 style={styles.hdPathText}>
          m/44&#39;/{hdPath.coinType}&#39;/
        </Typography.Body1>
      )}

      <TextInput
        style={styles.elements}
        inputStyle={styles.input}
        keyboardType="numeric"
        onChangeText={(v) => onElementChange(v, 'account')}
        value={hdPath.account.toString()}
        editable={disabled !== true}
      />
      <Text style={styles.hdPathText}>/</Text>
      <TextInput
        style={styles.elements}
        inputStyle={styles.input}
        keyboardType="numeric"
        onChangeText={(v) => onElementChange(v, 'change')}
        value={hdPath.change.toString()}
        editable={disabled !== true}
      />
      <Text style={styles.hdPathText}>/</Text>
      <TextInput
        style={styles.elements}
        inputStyle={styles.input}
        keyboardType="numeric"
        onChangeText={(v) => onElementChange(v, 'addressIndex')}
        value={hdPath.addressIndex.toString()}
        editable={disabled !== true}
      />
    </View>
  );
};

const useStyle = makeStyleWithProps((props: HdPathPickerProps, theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  elements: {
    maxWidth: 70,
    flexGrow: 1,
  },
  input: {
    textAlignVertical: 'center',
    color: props.disabled ? theme.colors.disabled : theme.colors.text,
  },
  hdPathText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: 0.005,
    textAlign: 'left',
    color: props.disabled ? theme.colors.disabled : theme.colors.text,
  },
}));
