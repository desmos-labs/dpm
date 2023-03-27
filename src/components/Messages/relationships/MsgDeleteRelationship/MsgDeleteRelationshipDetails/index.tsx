import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import React from 'react';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { msgGeneralIcon } from 'assets/images';
import { useTranslation } from 'react-i18next';
import { MsgDeleteRelationshipEncodeObject } from '@desmoslabs/desmjs';

const MsgDeleteRelationshipDetails: MessageDetailsComponent<MsgDeleteRelationshipEncodeObject> = ({
  message,
}) => {
  const { t } = useTranslation('messages.profiles');

  return (
    <BaseMessageDetails
      icon={msgGeneralIcon}
      iconSubtitle={t('delete relationship')}
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
          label: t('subspace id'),
          value: message.value.subspaceId.toString(),
        },
      ]}
    />
  );
};

export default MsgDeleteRelationshipDetails;
