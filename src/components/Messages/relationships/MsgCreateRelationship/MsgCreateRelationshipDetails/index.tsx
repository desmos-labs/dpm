import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import React from 'react';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { useTranslation } from 'react-i18next';
import { MsgCreateRelationshipEncodeObject } from '@desmoslabs/desmjs';

const MsgCreateRelationshipDetails: MessageDetailsComponent<MsgCreateRelationshipEncodeObject> = ({
  message,
}) => {
  const { t } = useTranslation('messages.relationships');

  return (
    <BaseMessageDetails
      message={message}
      fields={[
        {
          label: t('transaction:from'),
          value: message.value.signer,
        },
        {
          label: t('transaction:to'),
          value: message.value.counterparty,
        },
        {
          label: t('messages.subspaces:subspace id'),
          value: message.value.subspaceId.toString(),
        },
      ]}
    />
  );
};

export default MsgCreateRelationshipDetails;
