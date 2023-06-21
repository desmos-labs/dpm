import { MsgEditPostEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import BaseMessageDetails, {
  MessageDetailsField,
} from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import useGetGeneratePostEntitiesDetailFields from 'components/Messages/posts/hooks/useGetGeneratePostEntitiesDetailFields';
import Typography from 'components/Typography';
import CopiableAddress from 'components/CopiableAddress';

/**
 * Displays the full details of a MsgEditPost
 * @constructor
 */
const MsgEditPostDetails: MessageDetailsComponent<MsgEditPostEncodeObject> = ({
  message,
  toBroadcastMessage,
}) => {
  const { t } = useTranslation('messages.posts');
  const getEntitiesFields = useGetGeneratePostEntitiesDetailFields();

  const fields = React.useMemo<MessageDetailsField[]>(
    () => [
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
    ],
    [message, t, getEntitiesFields],
  );

  return (
    <BaseMessageDetails message={message} fields={fields}>
      <Typography.Regular14>
        <Trans
          ns="messages.posts"
          i18nKey={toBroadcastMessage ? 'edit post description' : 'edited post description'}
          components={[
            <CopiableAddress address={message.value.editor} />,
            <Typography.SemiBold14 />,
            <Typography.SemiBold14 />,
          ]}
          values={{
            subspaceId: message.value.subspaceId,
            postId: message.value.postId,
          }}
        />
      </Typography.Regular14>
    </BaseMessageDetails>
  );
};

export default MsgEditPostDetails;
