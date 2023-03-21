import { MessageDetailsComponentProps } from 'components/Messages/BaseMessage';
import React from 'react';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { msgGeneralIcon } from 'assets/images';
import { useTranslation } from 'react-i18next';
import { MsgRefuseDTagTransferRequestEncodeObject } from '@desmoslabs/desmjs';

type MsgRefuseDTagTransferRequestDetailsProps =
  MessageDetailsComponentProps<MsgRefuseDTagTransferRequestEncodeObject>;

const MsgRefuseDTagTransferDetails: React.FC<MsgRefuseDTagTransferRequestDetailsProps> = ({
  message,
}) => {
  const { t } = useTranslation('messages.profiles');

  return (
    <BaseMessageDetails
      icon={msgGeneralIcon}
      iconSubtitle={t('refuse dtag transfer')}
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
