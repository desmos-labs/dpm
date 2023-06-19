import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import React from 'react';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { msgGeneralIcon } from 'assets/images';
import { useTranslation } from 'react-i18next';
import { MsgUnblockUserEncodeObject } from '@desmoslabs/desmjs';

const MsgUnblockUserDetails: MessageDetailsComponent<MsgUnblockUserEncodeObject> = ({
  message,
}) => {
  const { t } = useTranslation('messages.relationships');

  return (
    <BaseMessageDetails
      icon={msgGeneralIcon}
      iconSubtitle={t('unblock user')}
      fields={[
        {
          label: t('blocker'),
          value: message.value.blocker,
        },
        {
          label: t('unblocked'),
          value: message.value.blocked,
        },
        {
          label: t('messages.subspaces:subspace id'),
          value: message.value.subspaceId.toString(),
        },
      ]}
    />
  );
};

export default MsgUnblockUserDetails;
