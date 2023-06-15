import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import React from 'react';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { useTranslation } from 'react-i18next';
import { MsgUnlinkApplicationEncodeObject } from '@desmoslabs/desmjs';

const MsgUnlinkApplicationDetails: MessageDetailsComponent<MsgUnlinkApplicationEncodeObject> = ({
  message,
}) => {
  const { t } = useTranslation('messages.profiles');

  return (
    <BaseMessageDetails
      message={message}
      fields={[
        {
          label: t('signer'),
          value: message.value.signer,
        },
        {
          label: t('application'),
          value: message.value.application,
        },
        {
          label: t('username'),
          value: message.value.username,
        },
      ]}
    />
  );
};

export default MsgUnlinkApplicationDetails;
