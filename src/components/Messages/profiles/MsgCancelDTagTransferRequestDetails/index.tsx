import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import React from 'react';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { useTranslation } from 'react-i18next';
import { MsgCancelDTagTransferRequestEncodeObject } from '@desmoslabs/desmjs';

const MsgCancelDTagTransferDetails: MessageDetailsComponent<
  MsgCancelDTagTransferRequestEncodeObject
> = ({ message }) => {
  const { t } = useTranslation('messages.profiles');

  return (
    <BaseMessageDetails
      message={message}
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
