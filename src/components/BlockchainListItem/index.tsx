import React from 'react';
import { Image, ImageSourcePropType, TouchableOpacity } from 'react-native';
import Typography from 'components/Typography';
import useStyles from './useStyles';

export type Props = {
  name: string;
  icon: ImageSourcePropType;
  onPress?: () => void;
};

const BlockchainListItem: React.FC<Props> = ({ name, icon, onPress }) => {
  const styles = useStyles();

  return (
    <TouchableOpacity style={styles.chainItem} onPress={onPress}>
      <Image style={styles.chainLogo} source={icon} resizeMode="contain" />
      <Typography.Body1 style={styles.chainLinkName}>{name}</Typography.Body1>
    </TouchableOpacity>
  );
};

export default BlockchainListItem;
