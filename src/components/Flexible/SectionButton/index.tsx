import React from 'react';
import { ImageProps, TouchableOpacity } from 'react-native';
import Typography from 'components/Typography';
import Icon from 'components/Flexible/Icon';
import FastImage from 'react-native-fast-image';
import useStyles from './useStyles';

type Props = {
  label: string;
  onPress?: () => void;
  icon?: ImageProps['source'];
};

const SectionButton: React.FC<Props> = (props) => {
  const { label, onPress, icon } = props;
  const styles = useStyles();

  return (
    <TouchableOpacity style={styles.root} onPress={onPress ?? onPress}>
      {icon && <FastImage style={styles.communityIcon} source={icon} resizeMode="contain" />}
      <Typography.Body1 style={styles.label}>{label}</Typography.Body1>
      <Icon name="arrow-right" />
    </TouchableOpacity>
  );
};

export default SectionButton;
