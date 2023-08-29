import { Posts } from '@desmoslabs/desmjs';
import React from 'react';
import { Trans } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import Typography from 'components/Typography';
import CopiableAddress from 'components/CopiableAddress';

/**
 * Displays the full details of a MsgMovePost
 * @constructor
 */
const MsgMovePostDetails: MessageDetailsComponent<Posts.v3.MsgMovePostEncodeObject> = ({
  message,
  toBroadcastMessage,
}) => (
  <BaseMessageDetails message={message}>
    <Typography.Regular14>
      <Trans
        ns="messages.posts"
        i18nKey={toBroadcastMessage ? 'move post description' : 'moved post description'}
        components={[
          <CopiableAddress address={message.value.owner} />,
          <Typography.SemiBold14 />,
          <Typography.SemiBold14 />,
          <Typography.SemiBold14 />,
          <Typography.SemiBold14 />,
        ]}
        values={{
          postId: message.value.postId,
          subspaceId: message.value.subspaceId,
          targetSubspaceId: message.value.targetSubspaceId,
          targetSectionId: message.value.targetSectionId,
        }}
      />
    </Typography.Regular14>
  </BaseMessageDetails>
);

export default MsgMovePostDetails;
