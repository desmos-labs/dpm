import { MsgAddPostAttachmentEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import { Trans } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import useGetGeneratePostAttachmentDetailFields from 'components/Messages/posts/hooks/useGetGeneratePostAttachmentsDetailFields';
import Typography from 'components/Typography';

/**
 * Displays the full details of a MsgAddPostAttachment
 * @constructor
 */
const MsgAddPostAttachment: MessageDetailsComponent<MsgAddPostAttachmentEncodeObject> = ({
  message,
}) => {
  const generateAttachmentFields = useGetGeneratePostAttachmentDetailFields();
  const fields = React.useMemo(
    () => generateAttachmentFields(message.value.content),
    [generateAttachmentFields, message.value.content],
  );

  return (
    <BaseMessageDetails message={message} fields={fields}>
      <Typography.Regular14>
        <Trans
          ns="messages.posts"
          i18nKey="add post attachment description"
          components={[
            <Typography.SemiBold14 />,
            <Typography.SemiBold14 />,
            <Typography.SemiBold14 />,
          ]}
          values={{
            attachmentType: message.value.content?.typeUrl?.split('.').pop(),
            postId: message.value.postId.toString(),
            subspaceId: message.value.subspaceId.toString(),
          }}
        />
      </Typography.Regular14>
    </BaseMessageDetails>
  );
};

export default MsgAddPostAttachment;