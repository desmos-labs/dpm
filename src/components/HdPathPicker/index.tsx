import React, { useEffect, useState } from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { DESMOS_COIN_TYPE, HdPath } from 'types/cosmos';
import Typography from 'components/Typography';
import TextInput from 'components/TextInput';
import useStyles from './useStyles';

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

const HdPathPicker: React.FC<HdPathPickerProps> = (props) => {
  const { onChange, value, disabled, allowCoinTypeEdit, style } = props;
  const styles = useStyles(props);
  const [hdPath, setHdPath] = useState<HdPath>(
    value ?? {
      coinType: DESMOS_COIN_TYPE,
      account: 0,
      change: 0,
      addressIndex: 0,
    },
  );

  useEffect(() => {
    if (value !== undefined) {
      setHdPath(value);
    }
  }, [value]);

  const onElementChange = (changedValue: string, changedElement: keyof HdPath) => {
    let newHdPath = hdPath;
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

export default HdPathPicker;
