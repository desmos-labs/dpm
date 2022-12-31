import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';
import React, { useCallback } from 'react';
import { ImageSourcePropType, View } from 'react-native';
import Typography from 'components/Typography';
import { ModalComponentProps, RootStackParams } from 'types/navigation';
import {DpmImages} from 'types/images';
import DpmImage from 'components/DPMImage';
import Button from 'components/Button';
import useStyles from './useStyles';

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
  image?: ImageSourcePropType | DpmImages;
  /**
   * Text displayed on the action button.
   */
  actionLabel: string;
  /**
   * Function called when the user clicks on the button.
   */
  action?: (navigation: StackNavigationProp<RootStackParams>) => void;
};

const SingleButtonModal: React.FC<ModalComponentProps<SingleButtonModalParams>> = (
  props,
) => {
  const { params, navigation } = props;
  const styles = useStyles();

  const btnAction = useCallback(() => {
    if (params.action) {
      navigation.goBack();
      params.action(navigation);
    } else {
      navigation.goBack();
    }
  }, [params, navigation]);

  return (
    <View style={styles.root}>
      {params.image && <DpmImage style={styles.image} resizeMode="contain" source={params.image} />}
      <Typography.Title style={[styles.centred, styles.title]}>{params.title}</Typography.Title>
      <Typography.Body style={styles.centred}>{params.message}</Typography.Body>
      <Button style={styles.button} mode="contained" onPress={btnAction}>
        {params.actionLabel}
      </Button>
    </View>
  );
};

export default SingleButtonModal;