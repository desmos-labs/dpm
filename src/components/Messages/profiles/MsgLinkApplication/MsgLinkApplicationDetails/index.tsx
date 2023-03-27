import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import React from 'react';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { msgGeneralIcon } from 'assets/images';
import { useTranslation } from 'react-i18next';
import { MsgLinkApplicationEncodeObject } from '@desmoslabs/desmjs';

const MsgLinkApplicationDetails: MessageDetailsComponent<MsgLinkApplicationEncodeObject> = ({
  message,
}) => {
  const { t } = useTranslation('messages.profiles');

  return (
    <BaseMessageDetails
      icon={msgGeneralIcon}
      iconSubtitle={t('link application')}
      fields={[
        {
          label: t('sender'),
          value: message.value.sender,
        },
        {
          label: t('application'),
          value: message.value.linkData?.application,
        },
        {
          label: t('username'),
          value: message.value.linkData?.username,
        },
        {
          label: t('call data'),
          value: message.value.callData,
        },
        {
          label: t('source channel'),
          value: message.value.sourceChannel,
        },
        {
          label: t('source port'),
          value: message.value.sourcePort,
        },
        {
          label: t('timeout height'),
          value: message.value.timeoutHeight?.revisionHeight?.toString(),
        },
        {
          label: t('timeout timestamp'),
          value: message.value.timeoutTimestamp.toString(),
        },
      ]}
    />
  );
};

export default MsgLinkApplicationDetails;
