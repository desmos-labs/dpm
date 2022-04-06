import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { makeStyle } from '../../theming';
import { Icon } from './Icon';
import { Typography } from '../typography';

export type Props = {
  label: string;
  onPress?: () => void;
};

export const SettingsButton: React.FC<Props> = (props) => {
  const { label, onPress } = props;
  const styles = useStyles();

  return (
    <TouchableOpacity style={styles.root} onPress={onPress ?? onPress}>
      <Typography.Body1 style={styles.label}>{label}</Typography.Body1>
      <Icon name="arrow-right" />
    </TouchableOpacity>
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
