import { MsgCreateUserGroupEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { msgGeneralIcon } from 'assets/images';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';

/**
 * Displays the full details of a MsgCreateUserGroup
 * @constructor
 */
const MsgCreateUserGroupDetails: MessageDetailsComponent<MsgCreateUserGroupEncodeObject> = ({
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
        label: t('section id'),
        value: message.value.sectionId.toString(),
      },
      {
        label: t('name'),
        value: message.value.name,
      },
      {
        label: t('description'),
        value: message.value.description,
      },
      {
        label: t('default permissions'),
        value: message.value.defaultPermissions.join('\n'),
      },
      {
        label: t('initial members'),
        value: message.value.initialMembers.join('\n'),
      },
      {
        label: t('creator'),
        value: message.value.creator,
      },
    ],
    [t, message],
  );

  return (
    <BaseMessageDetails
      icon={msgGeneralIcon}
      iconSubtitle={t('create user group')}
      fields={fields}
    />
  );
};

export default MsgCreateUserGroupDetails;
