import { Posts } from '@desmoslabs/desmjs';
import React from 'react';
import { Trans } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import Typography from 'components/Typography';
import CopiableAddress from 'components/CopiableAddress';

/**
 * Displays the full details of a MsgRemovePostAttachment
 * @constructor
 */
const MsgRemovePostAttachmentDetails: MessageDetailsComponent<
  Posts.v3.MsgRemovePostAttachmentEncodeObject
> = ({ message, toBroadcastMessage }) => (
  <BaseMessageDetails message={message}>
    <Typography.Regular14>
      <Trans
        ns="messages.posts"
        i18nKey={
          toBroadcastMessage
            ? 'remove post attachment description'
            : 'removed post attachment description'
        }
        components={[
          <CopiableAddress address={message.value.editor} />,
          <Typography.SemiBold14 />,
          <Typography.SemiBold14 />,
          <Typography.SemiBold14 />,
        ]}
        values={{
          attachmentId: message.value.attachmentId,
          postId: message.value.postId,
          subspaceId: message.value.subspaceId,
        }}
      />
    </Typography.Regular14>
  </BaseMessageDetails>
);

export default MsgRemovePostAttachmentDetails;
