import React from 'react';
import { View } from 'react-native';
import Typography from 'components/Typography';
import { DPMImages } from 'types/images';
import { ModalComponentProps } from 'modals/ModalScreen';
import DPMImage from 'components/DPMImage';
import { useTranslation } from 'react-i18next';
import useStyles from './useStyles';

export type SingleButtonModalParams = {
  /**
   * Text to be shown under the error icon.
   */
  text: string;
};

/**
 * Modal that shows an error.
 * @constructor
 */
const ErrorModal: React.FC<ModalComponentProps<SingleButtonModalParams>> = (props) => {
  const { t } = useTranslation();
  const styles = useStyles();

  const { params } = props;

  return (
    <View>
      <DPMImage style={styles.image} source={DPMImages.Fail} resizeMode="cover" />
      <Typography.Title style={styles.text}>{t('something went wrong')}</Typography.Title>
      <Typography.Body style={styles.text}>{params.text}</Typography.Body>
    </View>
  );
};

export default ErrorModal;
