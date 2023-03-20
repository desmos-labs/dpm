import { MessageDetailsComponentProps } from 'components/Messages/BaseMessage';
import React from 'react';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { msgGeneralIcon } from 'assets/images';
import { useTranslation } from 'react-i18next';
import { MsgUnlinkApplicationEncodeObject } from '@desmoslabs/desmjs';

type MsgUnlinkApplicationDetailsProps =
  MessageDetailsComponentProps<MsgUnlinkApplicationEncodeObject>;

const MsgUnlinkApplicationDetails: React.FC<MsgUnlinkApplicationDetailsProps> = ({ message }) => {
  const { t } = useTranslation('messages.profiles');

  return (
    <BaseMessageDetails
      icon={msgGeneralIcon}
      iconSubtitle={t('unlink application')}
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
