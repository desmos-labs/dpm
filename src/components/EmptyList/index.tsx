import React from 'react';
import { View } from 'react-native';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import DpmImage from 'components/DPMImage';
import { DPMImages } from 'types/images';
import useStyles from './useStyles';

export interface EmptyListProps {
  /**
   * Image displayed in the component.
   */
  image: DPMImages;
  /**
   * Message displayed below the image.
   */
  message: string;
  /**
   * Optional user provided component that will be displayed below the
   * message.
   */
  extraComponent?: React.ReactNode;
  /**
   * Override the default top padding.
   */
  topPadding?: number | string;
}

/**
 * Component that can be used as ListEmptyComponent of a FlashList.
 * This component will show an image, a message and an optional user
 * defined component below the message text.
 */
const EmptyList: React.FC<EmptyListProps> = ({ message, image, extraComponent, topPadding }) => {
  const styles = useStyles();

  return (
    <View style={styles.root}>
      <Spacer paddingVertical={topPadding ?? 32} />
      <DpmImage style={styles.image} source={image} resizeMode={'cover'} />
      <Spacer paddingVertical={16} />
      <Typography.Body>{message}</Typography.Body>
      {extraComponent !== undefined && (
        <>
          <Spacer paddingVertical={16} />
          {extraComponent}
        </>
      )}
    </View>
  );
};

export default EmptyList;
