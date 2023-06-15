import { MsgCreatePostEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseMessageDetails, {
  MessageDetailsField,
} from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import { replySettingToJSON } from '@desmoslabs/desmjs-types/desmos/posts/v3/models';
import useGetGeneratePostAttachmentsDetailFields from 'components/Messages/posts/hooks/useGetGeneratePostAttachmentsDetailFields';
import useGetGeneratePostEntitiesDetailFields from 'components/Messages/posts/hooks/useGetGeneratePostEntitiesDetailFields';

/**
 * Displays the full details of a MsgCreatePost
 * @constructor
 */
const MsgCreatePostDetails: MessageDetailsComponent<MsgCreatePostEncodeObject> = ({ message }) => {
  const { t } = useTranslation('messages.posts');
  const { t: tSubspces } = useTranslation('messages.subspaces');
  const getEntitiesFields = useGetGeneratePostEntitiesDetailFields();
  const getAttachmentFields = useGetGeneratePostAttachmentsDetailFields();

  const fields = React.useMemo<MessageDetailsField[]>(
    () => [
      {
        label: tSubspces('subspace id'),
        value: message.value.subspaceId.toString(),
      },
      {
        label: tSubspces('section id'),
        value: message.value.sectionId.toString(),
      },
      {
        label: t('external id'),
        value: message.value.externalId,
        hide: message.value.externalId.length === 0,
      },
      {
        label: t('text'),
        value: message.value.text,
        hide: message.value.text.length === 0,
      },
      {
        label: t('tags'),
        value: message.value.tags.join('\n'),
        hide: message.value.tags.length === 0,
      },
      ...getEntitiesFields(message.value.entities),
      {
        label: t('conversation id'),
        value: message.value.conversationId.toString(),
      },
      {
        label: t('replay settings'),
        value: replySettingToJSON(message.value.replySettings),
      },
      {
        label: t('referenced posts'),
        value: message.value.referencedPosts
          .map((r) => `${r.postId.toString()} - ${r.type}`)
          .join('\n'),
        hide: message.value.referencedPosts.length === 0,
      },
      ...message.value.attachments.flatMap((a) => getAttachmentFields(a)),
      {
        label: t('author'),
        value: message.value.author,
      },
    ],
    [tSubspces, message, t, getEntitiesFields, getAttachmentFields],
  );

  return <BaseMessageDetails message={message} fields={fields} />;
};

export default MsgCreatePostDetails;
