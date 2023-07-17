import React, { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { RadioButton, useTheme } from 'react-native-paper';
import Typography from 'components/Typography';
import useStyles from './useStyles';

export interface RadioValue {
  label: string;
  value: string;
  status: 'checked' | 'unchecked';
  onPress: () => void;
}

export type RadioGroupProps = {
  /**
   * Values to display, with a label, a value, a status and an onPress callback
   */
  values: RadioValue[];
};

const RadioGroup: React.FC<RadioGroupProps> = (props) => {
  const { values } = props;
  const styles = useStyles();
  const theme = useTheme();

  const wrapped = useMemo(() => {
    const count = values.length;
    return values.map((value, index) => {
      const last = count === index + 1;
      return (
        <TouchableOpacity
          key={`w_${index.toString()}`}
          onPress={value.onPress}
          disabled={value.onPress === undefined}
        >
          <View style={[styles.fieldWrapper, !last && styles.interBorder]}>
            <Typography.Subtitle style={styles.title}>{value.label}</Typography.Subtitle>
            <RadioButton
              value={value.value}
              status={value.status}
              color={theme.colors.primary}
              uncheckedColor={theme.colors.icon['3']}
              onPress={value.onPress ?? value.onPress}
              theme={theme}
            />
          </View>
        </TouchableOpacity>
      );
    });
  }, [values, styles, theme]);

  return (
    <View style={styles.root}>
      <View style={styles.fieldsContainer}>{wrapped}</View>
    </View>
  );
};

export default RadioGroup;
