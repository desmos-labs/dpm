import { MsgRemovePostAttachmentEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';

/**
 * Displays the full details of a MsgRemovePostAttachment
 * @constructor
 */
const MsgRemovePostAttachmentDetails: MessageDetailsComponent<
  MsgRemovePostAttachmentEncodeObject
> = ({ message }) => {
  const { t } = useTranslation('messages.posts');
  const { t: tSubspaces } = useTranslation('messages.subspaces');

  const fields = React.useMemo(
    () => [
      {
        label: tSubspaces('subspace id'),
        value: message.value.subspaceId.toString(),
      },
      {
        label: t('post id'),
        value: message.value.postId.toString(),
      },
      {
        label: t('attachment id'),
        value: message.value.attachmentId.toString(),
      },
      {
        label: t('editor'),
        value: message.value.editor,
      },
    ],
    [tSubspaces, t, message],
  );

  return <BaseMessageDetails message={message} fields={fields} />;
};

export default MsgRemovePostAttachmentDetails;
