import React from 'react';
import { View } from 'react-native';
import { makeStyle } from '../../theming';
import { Icon } from './Icon';
import { Typography } from '../typography';

export type Props = {
  label: string;
};

export const Select: React.FC<Props> = (props) => {
  const { label } = props;
  const styles = useStyles();

  return (
    <View style={styles.root}>
      <Typography.Body1 style={styles.label}>{label}</Typography.Body1>
      <Icon name="arrow-right" />
    </View>
  );
};

const useStyles = makeStyle((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    flex: 1,
  },
  value: {
    color: theme.colors.font['3'],
  },
}));
