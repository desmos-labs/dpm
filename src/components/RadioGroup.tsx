import React, { useMemo } from 'react';
import { View } from 'react-native';
import { RadioButton, useTheme } from 'react-native-paper';
import { makeStyle } from '../theming';
import { Typography } from './typography';

export interface RadioValue {
  label: string;
  value: string;
  status: 'checked' | 'unchecked';
  onPress: () => void;
}

export type Props = {
  /**
   * Values to display, with a label, a value, a status and an onPress callback
   */
  values: RadioValue[];
};

export const RadioGroup: React.FC<Props> = (props) => {
  const { values } = props;
  const styles = useStyles();
  const theme = useTheme();

  const wrapped = useMemo(() => {
    const count = values.length;
    return values.map((value, index) => {
      const last = count === index + 1;
      return (
        <View key={`w_${index.toString()}`}>
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
        </View>
      );
    });
  }, [
    values,
    styles.fieldWrapper,
    styles.interBorder,
    styles.title,
    theme.colors.primary,
    theme.colors.icon,
  ]);

  return (
    <View style={styles.root}>
      <View style={styles.fieldsContainer}>{wrapped}</View>
    </View>
  );
};

const useStyles = makeStyle((theme) => ({
  root: {
    flex: 1,
  },
  title: {
    color: theme.colors.font['2'],
  },
  fieldsContainer: {
    backgroundColor: theme.colors.surface2,
    borderRadius: theme.roundness,
  },
  fieldWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
  },
  interBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.line,
  },
}));
