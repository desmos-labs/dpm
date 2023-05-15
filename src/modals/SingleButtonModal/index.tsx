import React, { useCallback } from 'react';
import { View } from 'react-native';
import Typography from 'components/Typography';
import { DPMImages } from 'types/images';
import DpmImage from 'components/DPMImage';
import Button from 'components/Button';
import { ModalComponentProps } from 'modals/ModalScreen';
import FastImage from 'react-native-fast-image';
import useStyles from './useStyles';

type FastImageProps = React.ComponentProps<typeof FastImage>;

export type SingleButtonModalParams = {
  /**
   * Modal title.
   */
  title: string;
  /**
   * Modal message.
   */
  message: string;
  /**
   * Optional image that will be displayed on top
   * of the title.
   */
  image?: FastImageProps['source'] | DPMImages;
  /**
   * Text displayed on the action button.
   */
  actionLabel: string;
  /**
   * Function called when the user clicks on the button.
   */
  action?: () => void;
};

const SingleButtonModal: React.FC<ModalComponentProps<SingleButtonModalParams>> = (props) => {
  const { params, closeModal } = props;
  const styles = useStyles();

  const btnAction = useCallback(() => {
    closeModal();
    if (params.action) {
      params.action();
    }
  }, [params, closeModal]);

  return (
    <View style={styles.root}>
      {params.image && <DpmImage style={styles.image} resizeMode="contain" source={params.image} />}
      <Typography.Title style={styles.title}>{params.title}</Typography.Title>
      <Typography.Body style={styles.message}>{params.message}</Typography.Body>
      <Button style={styles.button} mode="contained" onPress={btnAction}>
        {params.actionLabel}
      </Button>
    </View>
  );
};

export default SingleButtonModal;
