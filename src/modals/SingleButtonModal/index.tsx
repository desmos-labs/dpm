import React from 'react';
import { View } from 'react-native';
import Typography from 'components/Typography';
import DpmImage, { DPMImageProps } from 'components/DPMImage';
import Button from 'components/Button';
import { ModalComponentProps } from 'modals/ModalScreen';
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
  image?: DPMImageProps['source'];
  /**
   * Text displayed on the action button.
   */
  actionLabel: string;
  /**
   * Function called when the user clicks on the button.
   */
  action?: () => void;
  /**
   * Amount of milliseconds that the button will remain disabled
   * before becoming enable.
   */
  disableButtonFor?: number;
};

const SingleButtonModal: React.FC<ModalComponentProps<SingleButtonModalParams>> = (props) => {
  const { params, closeModal } = props;
  const styles = useStyles(props.params);

  // -------- STATES --------

  const [buttonDisabled, setButtonDisabled] = React.useState(params.disableButtonFor !== undefined);

  // -------- CALLBACKS --------

  const btnAction = React.useCallback(() => {
    closeModal();
    if (params.action) {
      params.action();
    }
  }, [params, closeModal]);

  // -------- EFFECTS --------

  React.useEffect(() => {
    if (params.disableButtonFor) {
      setTimeout(() => {
        setButtonDisabled(false);
      }, params.disableButtonFor);
    }
  }, [params.disableButtonFor]);

  return (
    <View>
      {params.image && <DpmImage style={styles.image} resizeMode="contain" source={params.image} />}
      <Typography.Title style={styles.title}>{params.title}</Typography.Title>
      <Typography.Body style={styles.message}>{params.message}</Typography.Body>
      <Button
        style={styles.button}
        mode="contained"
        onPress={btnAction}
        disabled={buttonDisabled}
        loading={buttonDisabled}
        labelStyle={{ overflow: 'visible' }}
      >
        {params.actionLabel}
      </Button>
    </View>
  );
};

export default SingleButtonModal;
