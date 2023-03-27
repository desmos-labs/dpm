import { MsgAddUserToUserGroupEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { msgGeneralIcon } from 'assets/images';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';

/**
 * Displays the full details of a MsgAddUserToUserGroup
 * @constructor
 */
const MsgAddUserToUserGroupDetails: MessageDetailsComponent<MsgAddUserToUserGroupEncodeObject> = ({
  message,
}) => {
  const { t } = useTranslation('messages.subspaces');

  const fields = React.useMemo(
    () => [
      {
        label: t('subspace id'),
        value: message.value.subspaceId.toString(),
      },
      {
        label: t('group id'),
        value: message.value.groupId.toString(),
      },
      {
        label: t('user'),
        value: message.value.user,
      },
      {
        label: t('signer'),
        value: message.value.signer,
      },
    ],
    [t, message],
  );

  return (
    <BaseMessageDetails
      icon={msgGeneralIcon}
      iconSubtitle={t('add user to group')}
      fields={fields}
    />
  );
};

export default MsgAddUserToUserGroupDetails;