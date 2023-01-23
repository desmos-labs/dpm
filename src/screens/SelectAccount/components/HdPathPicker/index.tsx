import React, { useEffect, useRef, useState } from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Typography from 'components/Typography';
import TextInput from 'components/TextInput';
import { HdPath, Slip10RawIndex } from '@cosmjs/crypto';
import { safeParseInt, slip10IndexToString } from 'lib/FormatUtils';
import { DesmosHdPath } from 'config/HdPaths';
import { debounce } from 'lodash';
import useStyles from './useStyles';

type HdPathValues = 'coinType' | 'account' | 'change' | 'addressIndex';

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

const HdPathPicker: React.FC<HdPathPickerProps> = (props) => {
  const styles = useStyles(props);
  const { onChange, value, disabled, allowCoinTypeEdit, style } = props;

  const [hdPath, setHdPath] = useState<HdPath>(value ?? DesmosHdPath);
  const [hdPathValues, setHdPathValues] = useState<Record<HdPathValues, string | undefined>>({
    coinType: slip10IndexToString(DesmosHdPath[1]),
    account: slip10IndexToString(DesmosHdPath[2]),
    change: slip10IndexToString(DesmosHdPath[3]),
    addressIndex: slip10IndexToString(DesmosHdPath[4]),
  });

  useEffect(() => {
    if (value !== undefined) {
      setHdPath(value);
    }
  }, [value]);

  const onElementChange = (changedValue: string, changedElement: HdPathValues) => {
    let newHdPath = hdPath;
    switch (changedElement) {
      case 'coinType': {
        newHdPath = [
          hdPath[0],
          Slip10RawIndex.hardened(safeParseInt(changedValue)),
          hdPath[2],
          hdPath[3],
          hdPath[4],
        ];
        break;
      }
      case 'account':
        newHdPath = [
          hdPath[0],
          hdPath[1],
          Slip10RawIndex.hardened(safeParseInt(changedValue)),
          hdPath[3],
          hdPath[4],
        ];
        break;
      case 'change':
        newHdPath = [
          hdPath[0],
          hdPath[1],
          hdPath[2],
          Slip10RawIndex.normal(safeParseInt(changedValue)),
          hdPath[4],
        ];
        break;
      case 'addressIndex':
        newHdPath = [
          hdPath[0],
          hdPath[1],
          hdPath[2],
          hdPath[3],
          Slip10RawIndex.normal(safeParseInt(changedValue)),
        ];
        break;
      default:
        throw new Error('Unsupported change path value');
    }
    setHdPath(newHdPath);
    if (onChange !== undefined) {
      onChange(newHdPath);
    }
  };

  const debouncedElementChange = useRef(debounce(onElementChange, 750));

  // This function is used to avoid calling the onElementChange function each time an individual value is set.
  // It is wrapped in a debounce function to let the user have enough time to input multiple digits numbers.
  const onValueChange = (changedValue: string | undefined, changedElement: HdPathValues) => {
    setHdPathValues((values) => {
      const newValues: Record<string, string | undefined> = {
        ...values,
      };
      newValues[changedElement] = changedValue;
      return newValues;
    });

    if (changedValue !== undefined && changedValue !== '') {
      debouncedElementChange.current(changedValue, changedElement);
    } else {
      debouncedElementChange.current.cancel();
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
            onChangeText={(v) => onValueChange(v, 'coinType')}
            value={hdPathValues.coinType || ''}
            editable={disabled !== true}
          />
          <Text style={styles.hdPathText}>/</Text>
        </>
      ) : (
        <Typography.Body1 style={styles.hdPathText}>
          m/44&#39;/{slip10IndexToString(hdPath[1])}&#39;/
        </Typography.Body1>
      )}

      <TextInput
        style={styles.elements}
        inputStyle={styles.input}
        keyboardType="numeric"
        onChangeText={(v) => onValueChange(v, 'account')}
        value={hdPathValues.account || ''}
        editable={disabled !== true}
      />
      <Text style={styles.hdPathText}>/</Text>
      <TextInput
        style={styles.elements}
        inputStyle={styles.input}
        keyboardType="numeric"
        onChangeText={(v) => onValueChange(v, 'change')}
        value={hdPathValues.change || ''}
        editable={disabled !== true}
      />
      <Text style={styles.hdPathText}>/</Text>
      <TextInput
        style={styles.elements}
        inputStyle={styles.input}
        keyboardType="numeric"
        onChangeText={(v) => onValueChange(v, 'addressIndex')}
        value={hdPathValues.addressIndex || ''}
        editable={disabled !== true}
      />
    </View>
  );
};

export default HdPathPicker;
