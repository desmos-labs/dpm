import { MsgRemoveUserFromUserGroupEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';

/**
 * Displays the full details of a MsgRemoveUserFromUserGroup
 * @constructor
 */
const MsgRemoveUserFromUserGroupDetails: MessageDetailsComponent<
  MsgRemoveUserFromUserGroupEncodeObject
> = ({ message }) => {
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

  return <BaseMessageDetails message={message} fields={fields} />;
};

export default MsgRemoveUserFromUserGroupDetails;
