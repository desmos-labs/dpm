import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import React from 'react';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { useTranslation } from 'react-i18next';
import { MsgRefuseDTagTransferRequestEncodeObject } from '@desmoslabs/desmjs';

const MsgRefuseDTagTransferDetails: MessageDetailsComponent<
  MsgRefuseDTagTransferRequestEncodeObject
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

export default MsgRefuseDTagTransferDetails;
