import { MsgEditPostEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseMessageDetails, {
  MessageDetailsField,
} from 'components/Messages/BaseMessage/BaseMessageDetails';
import { msgGeneralIcon } from 'assets/images';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import useGetGeneratePostEntitiesDetailFields from 'components/Messages/posts/hooks/useGetGeneratePostEntitiesDetailFields';

/**
 * Displays the full details of a MsgEditPost
 * @constructor
 */
const MsgEditPostDetails: MessageDetailsComponent<MsgEditPostEncodeObject> = ({ message }) => {
  const { t } = useTranslation('messages.posts');
  const { t: tSubspces } = useTranslation('messages.subspaces');
  const getEntitiesFields = useGetGeneratePostEntitiesDetailFields();

  const fields = React.useMemo<MessageDetailsField[]>(
    () => [
      {
        label: tSubspces('subspace id'),
        value: message.value.subspaceId.toString(),
      },
      {
        label: t('post id'),
        value: message.value.postId.toString(),
      },
      {
        label: t('text'),
        value: message.value.text,
        hide: message.value.text.length === 0,
      },
      ...getEntitiesFields(message.value.entities),
      {
        label: t('tags'),
        value: message.value.tags.join('\n'),
        hide: message.value.tags.length === 0,
      },
      {
        label: t('editor'),
        value: message.value.editor,
      },
    ],
    [tSubspces, message, t, getEntitiesFields],
  );

  return <BaseMessageDetails icon={msgGeneralIcon} iconSubtitle={t('edit post')} fields={fields} />;
};

export default MsgEditPostDetails;
