import React, { useCallback } from 'react';
import { View } from 'react-native';
import Typography from 'components/Typography';
import Button from 'components/Button';
import { ModalComponentProps } from 'modals/ModalScreen';
import useStyles from './useStyles';

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

const TwoButtonModal: React.FC<ModalComponentProps<TwoButtonModalParams>> = (props) => {
  const { params } = props;
  const styles = useStyles();

  const positiveAction = useCallback(() => {
    if (params.positiveAction !== undefined) {
      params.positiveAction();
    }
  }, [params]);

  const negativeAction = useCallback(() => {
    if (params.negativeAction !== undefined) {
      params.negativeAction();
    }
  }, [params]);

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

export default TwoButtonModal;
