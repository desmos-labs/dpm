import React from 'react';
import { View } from 'react-native';
import { makeStyle } from '../../theming';
import { Typography } from '../typography';

export type Props = {
  label: string;
  value: string;
};

export const SectionText: React.FC<Props> = (props) => {
  const { label, value } = props;
  const styles = useStyles();

  return (
    <View style={styles.root}>
      <Typography.Body1 style={styles.label}>{label}</Typography.Body1>
      <Typography.Body1 style={styles.value}>{value}</Typography.Body1>
    </View>
  );
};

const useStyles = makeStyle((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    padding: theme.spacing.m,
  },
  label: {
    flex: 1,
  },
  value: {
    color: theme.colors.font['3'],
  },
}));
