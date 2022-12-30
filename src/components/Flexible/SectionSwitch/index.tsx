import React from 'react';
import { View } from 'react-native';
import Switch from 'components/Switch';
import Typography from 'components/Typography';
import useStyles from './useStyles';

export type Props = {
  label: string;
  value: boolean;
  isDisabled: boolean;
  onPress: () => void;
};

const SectionSwitch: React.FC<Props> = (props) => {
  const { label, value, isDisabled, onPress } = props;
  const styles = useStyles();

  return (
    <View style={styles.root}>
      <Typography.Body1 style={[styles.label, isDisabled ? styles.disabled : null]}>
        {label}
      </Typography.Body1>
      <Switch value={value} isDisabled={isDisabled} onPress={onPress} />
    </View>
  );
};

export default SectionSwitch;
