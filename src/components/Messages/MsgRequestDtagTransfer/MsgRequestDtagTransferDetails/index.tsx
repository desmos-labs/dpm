import { MessageDetailsComponentProps } from 'components/Messages/BaseMessage';
import { MsgRequestDTagTransferEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { msgGeneralIcon } from 'assets/images';
import { useTranslation } from 'react-i18next';

type MsgRequestDtagTransferDetailsProps =
  MessageDetailsComponentProps<MsgRequestDTagTransferEncodeObject>;

const MsgRequestDtagTransferDetails: React.FC<MsgRequestDtagTransferDetailsProps> = ({
  message,
}) => {
  const { t } = useTranslation('messages.profiles');

  return (
    <BaseMessageDetails
      icon={msgGeneralIcon}
      iconSubtitle={t('request dtag transfer')}
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

export default MsgRequestDtagTransferDetails;
