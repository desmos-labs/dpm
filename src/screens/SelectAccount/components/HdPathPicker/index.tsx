import React, { useEffect, useState } from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Typography from 'components/Typography';
import TextInput from 'components/TextInput';
import { HdPath, Slip10RawIndex } from '@cosmjs/crypto';
import { safeParseInt, slip10IndexToString } from 'lib/FormatUtils';
import { DesmosHdPath } from 'config/HdPaths';
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
  const { onChange, value, disabled, allowCoinTypeEdit, style } = props;
  const styles = useStyles(props);
  const [hdPath, setHdPath] = useState<HdPath>(value ?? DesmosHdPath);

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
            value={slip10IndexToString(hdPath[1])}
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
        onChangeText={(v) => onElementChange(v, 'account')}
        value={slip10IndexToString(hdPath[2])}
        editable={disabled !== true}
      />
      <Text style={styles.hdPathText}>/</Text>
      <TextInput
        style={styles.elements}
        inputStyle={styles.input}
        keyboardType="numeric"
        onChangeText={(v) => onElementChange(v, 'change')}
        value={slip10IndexToString(hdPath[3])}
        editable={disabled !== true}
      />
      <Text style={styles.hdPathText}>/</Text>
      <TextInput
        style={styles.elements}
        inputStyle={styles.input}
        keyboardType="numeric"
        onChangeText={(v) => onElementChange(v, 'addressIndex')}
        value={slip10IndexToString(hdPath[4])}
        editable={disabled !== true}
      />
    </View>
  );
};

export default HdPathPicker;
