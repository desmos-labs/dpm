import React, { useMemo } from 'react';
import { ImageSourcePropType, TouchableOpacity } from 'react-native';
import Typography from 'components/Typography';
import FastImage from 'react-native-fast-image';
import { getImageSource } from 'lib/ImageUtils';
import useStyles from './useStyles';

export type BlockchainListItemProps = {
  name: string;
  icon: ImageSourcePropType;
  onPress?: () => void;
};

const BlockchainListItem = (props: BlockchainListItemProps) => {
  const styles = useStyles();
  const { name, icon, onPress } = props;
  const imageSource = useMemo(() => getImageSource(icon), [icon]);

  return (
    <TouchableOpacity style={styles.chainItem} onPress={onPress}>
      <FastImage style={styles.chainLogo} source={imageSource} resizeMode="contain" />
      <Typography.Body1 style={styles.chainLinkName}>{name}</Typography.Body1>
    </TouchableOpacity>
  );
};

export default BlockchainListItem;
