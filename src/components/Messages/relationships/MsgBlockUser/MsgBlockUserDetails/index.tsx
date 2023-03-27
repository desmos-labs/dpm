import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import React from 'react';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { msgGeneralIcon } from 'assets/images';
import { useTranslation } from 'react-i18next';
import { MsgBlockUserEncodeObject } from '@desmoslabs/desmjs';

const MsgBlockUserDetails: MessageDetailsComponent<MsgBlockUserEncodeObject> = ({ message }) => {
  const { t } = useTranslation('messages.profiles');

  return (
    <BaseMessageDetails
      icon={msgGeneralIcon}
      iconSubtitle={t('block user')}
      fields={[
        {
          label: t('blocker'),
          value: message.value.blocker,
        },
        {
          label: t('blocked'),
          value: message.value.blocked,
        },
        {
          label: t('block reason'),
          value: message.value.reason,
        },
        {
          label: t('subspace id'),
          value: message.value.subspaceId.toString(),
        },
      ]}
    />
  );
};

export default MsgBlockUserDetails;
