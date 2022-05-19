import React, { useCallback } from 'react';
import { View } from 'react-native';
import { Button } from '../components';
import { Typography } from '../components/typography';
import { makeStyle } from '../theming';
import { ModalComponentProps } from '../types/navigation';

export type TwoButtonModalParams = {
  /**
   * Modal title.
   */
  title: string;
  /**
   * Modal message.
   */
  message: string;
  /**
   * Text displayed on the positive action button.
   */
  positiveActionLabel: string;
  /**
   * Function called when the user clicks on the positive button.
   */
  positiveAction?: () => void;
  /**
   * Text displayed on the negative action button.
   */
  negativeActionLabel: string;
  /**
   * Function called when the user clicks on the negative button.
   */
  negativeAction?: () => void;
};

export const TwoButtonModal: React.FC<ModalComponentProps<TwoButtonModalParams>> = (props) => {
  const { params, navigation } = props;
  const styles = useStyles();

  const positiveAction = useCallback(() => {
    if (params.positiveAction !== undefined) {
      params.positiveAction();
    }
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [params, navigation]);

  const negativeAction = useCallback(() => {
    if (params.negativeAction !== undefined) {
      params.negativeAction();
    }
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [params, navigation]);

  return (
    <View style={styles.root}>
      <Typography.Title style={[styles.centred, styles.title]}>{params.title}</Typography.Title>
      <Typography.Body style={styles.message}>{params.message}</Typography.Body>
      <View style={styles.buttonsRow}>
        <Button mode="contained" onPress={negativeAction} accent>
          {params.negativeActionLabel}
        </Button>
        <Button mode="contained" onPress={positiveAction}>
          {params.positiveActionLabel}
        </Button>
      </View>
    </View>
  );
};

const useStyles = makeStyle((theme) => ({
  root: {
    minWidth: '60%',
    maxWidth: '70%',
  },
  title: {
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    marginTop: 8,
  },
  buttonsRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: theme.spacing.m,
  },
  centred: {
    alignSelf: 'center',
  },
}));
