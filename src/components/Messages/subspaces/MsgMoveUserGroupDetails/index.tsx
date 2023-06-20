import { MsgMoveUserGroupEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import { Trans } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import Typography from 'components/Typography';
import CopiableAddress from 'components/CopiableAddress';

/**
 * Displays the full details of a MsgMoveUserGroup
 * @constructor
 */
const MsgMoveUserGroupDetails: MessageDetailsComponent<MsgMoveUserGroupEncodeObject> = ({
  message,
}) => (
  <BaseMessageDetails message={message}>
    <Typography.Regular14>
      <Trans
        ns="messages.subspaces"
        i18nKey="move user group description"
        components={[
          <CopiableAddress address={message.value.signer} />,
          <Typography.SemiBold14 />,
          <Typography.SemiBold14 />,
          <Typography.SemiBold14 />,
        ]}
        values={{
          subspaceId: message.value.subspaceId,
          groupId: message.value.groupId,
          newSectionId: message.value.newSectionId,
        }}
      />
    </Typography.Regular14>
  </BaseMessageDetails>
);

export default MsgMoveUserGroupDetails;
