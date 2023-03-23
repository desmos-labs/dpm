import { MsgCreatePostEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseMessageDetails, {
  MessageDetailsField,
} from 'components/Messages/BaseMessage/BaseMessageDetails';
import { msgGeneralIcon } from 'assets/images';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import { replySettingToJSON } from '@desmoslabs/desmjs-types/desmos/posts/v2/models';
import { useGetAttachmentsFields } from 'components/Messages/posts/MsgCreatePost/MsgCreatePostDetails/hooks';

/**
 * Displays the full details of a MsgCreatePost
 * @constructor
 */
const MsgCreatePostDetails: MessageDetailsComponent<MsgCreatePostEncodeObject> = ({ message }) => {
  const { t } = useTranslation('messages.posts');
  const { t: tSubspces } = useTranslation('messages.subspaces');
  const getAttachmentsFields = useGetAttachmentsFields();

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
      {
        label: t('hashtags'),
        value: message.value.entities?.hashtags?.map((h) => h.tag).join('\n'),
        hide: (message.value.entities?.hashtags?.length ?? 0) === 0,
      },
      {
        label: t('mentions'),
        value: message.value.entities?.mentions?.map((m) => m.tag).join('\n'),
        hide: (message.value.entities?.mentions?.length ?? 0) === 0,
      },
      {
        label: t('urls'),
        value: message.value.entities?.urls?.map((m) => `${m.displayUrl} - ${m.url}`).join('\n'),
        hide: (message.value.entities?.urls?.length ?? 0) === 0,
      },
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
      ...getAttachmentsFields(message.value),
      {
        label: t('author'),
        value: message.value.author,
      },
    ],
    [tSubspces, message.value, t, getAttachmentsFields],
  );

  return (
    <BaseMessageDetails icon={msgGeneralIcon} iconSubtitle={t('create post')} fields={fields} />
  );
};

export default MsgCreatePostDetails;
