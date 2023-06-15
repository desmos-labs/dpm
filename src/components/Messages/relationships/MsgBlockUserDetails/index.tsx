import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import React from 'react';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { useTranslation } from 'react-i18next';
import { MsgBlockUserEncodeObject } from '@desmoslabs/desmjs';

const MsgBlockUserDetails: MessageDetailsComponent<MsgBlockUserEncodeObject> = ({ message }) => {
  const { t } = useTranslation('messages.profiles');

  return (
    <BaseMessageDetails
      message={message}
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
          label: t('messages.subspaces:subspace id'),
          value: message.value.subspaceId.toString(),
        },
      ]}
    />
  );
};

export default MsgBlockUserDetails;
