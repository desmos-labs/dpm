import { MsgAddPostAttachmentEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { msgGeneralIcon } from 'assets/images';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import useGetGeneratePostAttachmentDetailFields from 'components/Messages/posts/hooks/useGetGeneratePostAttachmentsDetailFields';

/**
 * Displays the full details of a MsgAddPostAttachment
 * @constructor
 */
const MsgEditSubspaceDetails: MessageDetailsComponent<MsgAddPostAttachmentEncodeObject> = ({
  message,
}) => {
  const { t } = useTranslation('messages.posts');
  const { t: tSubspaces } = useTranslation('messages.subspaces');
  const generateAttachmentFields = useGetGeneratePostAttachmentDetailFields();

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
      ...generateAttachmentFields(message.value.content),
      {
        label: t('editor'),
        value: message.value.editor,
      },
    ],
    [tSubspaces, message, t, generateAttachmentFields],
  );

  return (
    <BaseMessageDetails
      icon={msgGeneralIcon}
      iconSubtitle={t('add post attachment')}
      fields={fields}
    />
  );
};

export default MsgEditSubspaceDetails;
