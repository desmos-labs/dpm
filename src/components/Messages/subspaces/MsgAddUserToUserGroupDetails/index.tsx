import { Subspaces } from '@desmoslabs/desmjs';
import React from 'react';
import { Trans } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import Typography from 'components/Typography';
import CopiableAddress from 'components/CopiableAddress';

/**
 * Displays the full details of a MsgAddUserToUserGroup
 * @constructor
 */
const MsgAddUserToUserGroupDetails: MessageDetailsComponent<
  Subspaces.v3.MsgAddUserToUserGroupEncodeObject
> = ({ message, toBroadcastMessage }) => (
  <BaseMessageDetails message={message}>
    <Typography.Regular14>
      <Trans
        ns="messages.subspaces"
        i18nKey={
          toBroadcastMessage ? 'add user to group description' : 'added user to group description'
        }
        components={[
          <CopiableAddress address={message.value.signer} />,
          <CopiableAddress address={message.value.user} />,
          <Typography.SemiBold14 />,
          <Typography.SemiBold14 />,
        ]}
        values={{
          subspaceId: message.value.subspaceId,
          groupId: message.value.groupId,
        }}
      />
    </Typography.Regular14>
  </BaseMessageDetails>
);

export default MsgAddUserToUserGroupDetails;
