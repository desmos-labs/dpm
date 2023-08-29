import { Posts } from '@desmoslabs/desmjs';
import React from 'react';
import { Trans } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import Typography from 'components/Typography';
import CopiableAddress from 'components/CopiableAddress';

/**
 * Displays the full details of a MsgAcceptPostOwnerTransferRequest
 * @constructor
 */
const MsgAcceptPostOwnerTransferRequestDetails: MessageDetailsComponent<
  Posts.v3.MsgAcceptPostOwnerTransferRequestEncodeObject
> = ({ message, toBroadcastMessage }) => (
  <BaseMessageDetails message={message}>
    <Typography.Regular14>
      <Trans
        ns="messages.posts"
        i18nKey={
          toBroadcastMessage
            ? 'accept post owner transfer request description'
            : 'accepted post owner transfer request description'
        }
        components={[
          <CopiableAddress address={message.value.receiver} />,
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

export default MsgAcceptPostOwnerTransferRequestDetails;
