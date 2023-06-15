import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import { MsgAcceptDTagTransferRequestEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';

const MsgAcceptDtagTransferDetails: MessageDetailsComponent<
  MsgAcceptDTagTransferRequestEncodeObject
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
        {
          label: t('new dtag'),
          value: message.value.newDtag,
        },
      ]}
    />
  );
};

export default MsgAcceptDtagTransferDetails;
