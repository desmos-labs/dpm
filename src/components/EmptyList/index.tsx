import React from 'react';
import { View } from 'react-native';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import DpmImage from 'components/DPMImage';
import { DPMImages } from 'types/images';
import useStyles from './useStyles';

export interface EmptyListProps {
  message: string;
  image: DPMImages;
}

const EmptyList: React.FC<EmptyListProps> = ({ message, image }) => {
  const styles = useStyles();

  return (
    <View style={styles.root}>
      <Spacer paddingVertical={32} />
      <DpmImage style={styles.image} source={image} resizeMode={'contain'} />
      <Spacer paddingVertical={16} />
      <Typography.Body>{message}</Typography.Body>
    </View>
  );
};

export default EmptyList;
