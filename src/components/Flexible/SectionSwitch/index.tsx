import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import Switch from 'components/Switch';
import Typography from 'components/Typography';
import useStyles from './useStyles';

type Props = {
  label: string;
  value: boolean;
  isDisabled: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

const SectionSwitch: React.FC<Props> = ({ label, value, isDisabled, onPress, style }) => {
  const styles = useStyles();

  return (
    <View style={[styles.root, style]}>
      <Typography.Body1 style={[styles.label, isDisabled ? styles.disabled : null]}>
        {label}
      </Typography.Body1>
      <Switch value={value} isDisabled={isDisabled} onPress={onPress} />
    </View>
  );
};

export default SectionSwitch;
