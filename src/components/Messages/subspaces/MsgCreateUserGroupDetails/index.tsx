import { MsgCreateUserGroupEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import Typography from 'components/Typography';
import CopiableAddress from 'components/CopiableAddress';

/**
 * Displays the full details of a MsgCreateUserGroup
 * @constructor
 */
const MsgCreateUserGroupDetails: MessageDetailsComponent<MsgCreateUserGroupEncodeObject> = ({
  message,
  toBroadcastMessage,
}) => {
  const { t } = useTranslation('messages.subspaces');

  const fields = React.useMemo(
    () => [
      {
        label: t('description'),
        value: message.value.description,
      },
      {
        label: t('initial members'),
        value: message.value.initialMembers.join('\n'),
        hide: message.value.initialMembers.length === 0,
      },
      {
        label: t('default permissions'),
        value: message.value.defaultPermissions.join('\n'),
        hide: message.value.defaultPermissions.length === 0,
      },
      {
        label: t('section id'),
        value: message.value.sectionId?.toString(),
        hide: message.value.sectionId === undefined,
      },
    ],
    [t, message],
  );

  return (
    <BaseMessageDetails message={message} fields={fields}>
      <Typography.Regular14>
        <Trans
          ns="messages.subspaces"
          i18nKey={
            toBroadcastMessage ? 'create user group description' : 'created user group description'
          }
          components={[
            <CopiableAddress address={message.value.creator} />,
            <Typography.SemiBold14 />,
            <Typography.SemiBold14 />,
          ]}
          values={{
            subspaceId: message.value.subspaceId,
            name: message.value.name,
          }}
        />
      </Typography.Regular14>
    </BaseMessageDetails>
  );
};

export default MsgCreateUserGroupDetails;
