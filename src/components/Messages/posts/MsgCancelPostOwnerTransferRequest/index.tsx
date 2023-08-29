import { Posts } from '@desmoslabs/desmjs';
import React from 'react';
import { Trans } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import Typography from 'components/Typography';
import CopiableAddress from 'components/CopiableAddress';

/**
 * Displays the full details of a MsgCancelPostOwnerTransferRequest
 * @constructor
 */
const MsgCancelPostOwnerTransferRequestDetails: MessageDetailsComponent<
  Posts.v3.MsgCancelPostOwnerTransferRequestEncodeObject
> = ({ message, toBroadcastMessage }) => (
  <BaseMessageDetails message={message}>
    <Typography.Regular14>
      <Trans
        ns="messages.posts"
        i18nKey={
          toBroadcastMessage
            ? 'cancel post owner transfer request description'
            : 'canceled post owner transfer request description'
        }
        components={[
          <CopiableAddress address={message.value.sender} />,
          <Typography.SemiBold14 />,
          <Typography.SemiBold14 />,
        ]}
        values={{
          postId: message.value.postId,
          subspaceId: message.value.subspaceId,
        }}
      />
    </Typography.Regular14>
  </BaseMessageDetails>
);

export default MsgCancelPostOwnerTransferRequestDetails;
