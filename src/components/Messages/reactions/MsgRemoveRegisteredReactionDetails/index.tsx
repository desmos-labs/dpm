import { Reactions } from '@desmoslabs/desmjs';
import React from 'react';
import { Trans } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import Typography from 'components/Typography';
import CopiableAddress from 'components/CopiableAddress';

/**
 * Displays the full details of a MsgRemoveRegisteredReaction
 * @constructor
 */
const MsgRemoveRegisteredReactionDetails: MessageDetailsComponent<
  Reactions.v1.MsgRemoveRegisteredReactionEncodeObject
> = ({ message, toBroadcastMessage }) => (
  <BaseMessageDetails message={message}>
    <Typography.Regular14>
      <Trans
        ns="messages.reactions"
        i18nKey={
          toBroadcastMessage
            ? 'remove registered reaction description'
            : 'removed registered reaction description'
        }
        components={[
          <CopiableAddress address={message.value.user} />,
          <Typography.SemiBold14 />,
          <Typography.SemiBold14 />,
        ]}
        values={{
          reactionId: message.value.registeredReactionId,
          subspaceId: message.value.subspaceId,
        }}
      />
    </Typography.Regular14>
  </BaseMessageDetails>
);

export default MsgRemoveRegisteredReactionDetails;
