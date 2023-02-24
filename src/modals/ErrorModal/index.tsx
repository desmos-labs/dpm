import React from 'react';
import { ModalComponentProps } from 'modals/ModalScreen';
import { useTranslation } from 'react-i18next';
import SingleButtonModal from 'modals/SingleButtonModal';
import { DPMImages } from 'types/images';

export type ErrorModalParams = {
  /**
   * Text to be shown under the error icon.
   */
  text: string;

  /**
   * Function called when the user clicks on the continue button.
   */
  action?: () => void;
};

/**
 * Modal that shows an error.
 * @constructor
 */
const ErrorModal: React.FC<ModalComponentProps<ErrorModalParams>> = (props) => {
  const { t } = useTranslation();

  const { params, closeModal } = props;

  return (
    <SingleButtonModal
      params={{
        title: t('something went wrong'),
        message: params.text,
        image: DPMImages.Fail,
        actionLabel: t('continue'),
        action: params.action,
      }}
      closeModal={closeModal}
    />
  );
};

export default ErrorModal;
