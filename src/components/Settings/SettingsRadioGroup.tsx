import React, { useMemo } from 'react';
import { View } from 'react-native';
import { RadioButton, useTheme } from 'react-native-paper';
import { makeStyle } from '../../theming';
import { Divider } from '../Divider';
import { Typography } from '../typography';

export interface RadioValue {
  label: string;
  value: string;
  status: 'checked' | 'unchecked';
  onPress: () => void;
}

export type Props = {
  values: RadioValue[];
};

export const SettingsRadioGroup: React.FC<Props> = (props) => {
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
  root: {},
  title: {
    color: theme.colors.font['2'],
  },
  fieldsContainer: {
    backgroundColor: theme.colors.surface2,
    borderRadius: theme.roundness,
  },
  fieldWrapper: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  interBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.line,
  },
}));
