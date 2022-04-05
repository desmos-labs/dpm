import React from 'react';
import { View } from 'react-native';
import { makeStyle } from '../../theming';
import { Switch } from '../Switch';
import { Typography } from '../typography';

export type Props = {
  label: string;
  isActive: boolean;
};

export const SettingsSwitch: React.FC<Props> = (props) => {
  const { label, isActive } = props;
  const styles = useStyles();

  return (
    <View style={styles.root}>
      <Typography.Body1 style={styles.label}>{label}</Typography.Body1>
      <Switch isActive={isActive} />
    </View>
  );
};

const useStyles = makeStyle((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  label: {
    flex: 1,
  },
  value: {
    color: theme.colors.font['3'],
  },
}));
