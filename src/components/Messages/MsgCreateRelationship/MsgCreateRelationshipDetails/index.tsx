import { MessageDetailsComponentProps } from 'components/Messages/BaseMessage';
import React from 'react';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { msgGeneralIcon } from 'assets/images';
import { useTranslation } from 'react-i18next';
import { MsgCreateRelationshipEncodeObject } from '@desmoslabs/desmjs';

type MsgCreateRelationshipDetailsProps =
  MessageDetailsComponentProps<MsgCreateRelationshipEncodeObject>;

const MsgCancelDTagTransferDetails: React.FC<MsgCreateRelationshipDetailsProps> = ({ message }) => {
  const { t } = useTranslation('messages.profiles');

  return (
    <BaseMessageDetails
      icon={msgGeneralIcon}
      iconSubtitle={t('create relationship')}
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

export default MsgCancelDTagTransferDetails;
