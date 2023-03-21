import { MessageDetailsComponentProps } from 'components/Messages/BaseMessage';
import React from 'react';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { msgGeneralIcon } from 'assets/images';
import { useTranslation } from 'react-i18next';
import { MsgCancelDTagTransferRequestEncodeObject } from '@desmoslabs/desmjs';

type MsgCancelDTagTransferRequestDetailsProps =
  MessageDetailsComponentProps<MsgCancelDTagTransferRequestEncodeObject>;

const MsgCancelDTagTransferDetails: React.FC<MsgCancelDTagTransferRequestDetailsProps> = ({
  message,
}) => {
  const { t } = useTranslation('messages.profiles');

  return (
    <BaseMessageDetails
      icon={msgGeneralIcon}
      iconSubtitle={t('cancel dtag transfer')}
      fields={[
        {
          label: t('transaction:from'),
          value: message.value.sender,
        },
        {
          label: t('transaction:to'),
          value: message.value.receiver,
        },
      ]}
    />
  );
};

export default MsgCancelDTagTransferDetails;
