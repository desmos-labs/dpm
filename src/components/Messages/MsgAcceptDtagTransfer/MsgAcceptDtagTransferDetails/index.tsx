import { MessageDetailsComponentProps } from 'components/Messages/BaseMessage';
import { MsgAcceptDTagTransferRequestEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { msgGeneralIcon } from 'assets/images';

type MsgAcceptDtagTransferDetailsProps =
  MessageDetailsComponentProps<MsgAcceptDTagTransferRequestEncodeObject>;

const MsgAcceptDtagTransferDetails: React.FC<MsgAcceptDtagTransferDetailsProps> = ({ message }) => {
  const { t } = useTranslation('messages.profiles');

  return (
    <BaseMessageDetails
      icon={msgGeneralIcon}
      iconSubtitle={t('accept dtag transfer')}
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
