import { MsgMoveUserGroupEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';

/**
 * Displays the full details of a MsgMoveUserGroup
 * @constructor
 */
const MsgMoveUserGroupDetails: MessageDetailsComponent<MsgMoveUserGroupEncodeObject> = ({
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
        label: t('new section id'),
        value: message.value.newSectionId.toString(),
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

export default MsgMoveUserGroupDetails;
