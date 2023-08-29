import { Posts } from '@desmoslabs/desmjs';
import React from 'react';
import { Trans } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import Typography from 'components/Typography';
import CopiableAddress from 'components/CopiableAddress';

/**
 * Displays the full details of a MsgRequestPostOwnerTransfer
 * @constructor
 */
const MsgRequestPostOwnerTransferDetails: MessageDetailsComponent<
  Posts.v3.MsgRequestPostOwnerTransferEncodeObject
> = ({ message, toBroadcastMessage }) => (
  <BaseMessageDetails message={message}>
    <Typography.Regular14>
      <Trans
        ns="messages.posts"
        i18nKey={
          toBroadcastMessage
            ? 'request post owner transfer description'
            : 'requested post owner transfer description'
        }
        components={[
          <CopiableAddress address={message.value.sender} />,
          <Typography.SemiBold14 />,
          <Typography.SemiBold14 />,
          <CopiableAddress address={message.value.receiver} />,
        ]}
        values={{
          postId: message.value.postId,
          subspaceId: message.value.subspaceId,
        }}
      />
    </Typography.Regular14>
  </BaseMessageDetails>
);

export default MsgRequestPostOwnerTransferDetails;
