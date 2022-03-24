import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';
import React, { useCallback } from 'react';
import { ImageSourcePropType, View } from 'react-native';
import { Button, Typography } from '../components';
import { DpmImage, DpmImages } from '../components/DpmImage';
import { makeStyle } from '../theming';
import { ModalComponent, RootStackParams } from '../types/navigation';

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

export const SingleButtonModal: ModalComponent<SingleButtonModalParams> = (props) => {
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

const useStyles = makeStyle((theme) => ({
  root: {},
  image: {
    alignSelf: 'center',
    width: 200,
    height: 100,
  },
  title: {
    marginTop: theme.spacing.s,
  },
  button: {
    marginTop: theme.spacing.m,
  },
  centred: {
    alignSelf: 'center',
  },
}));
