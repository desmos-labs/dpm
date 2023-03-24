import React from 'react';
import { useTranslation } from 'react-i18next';
import { msgGeneralIcon } from 'assets/images';
import { View } from 'react-native';
import Typography from 'components/Typography';
import BaseMessageListItem from 'components/Messages/BaseMessage/BaseMessageListItem';
import { MessageListItemComponent } from 'components/Messages/BaseMessage';
import { MsgRemovePostAttachmentEncodeObject } from '@desmoslabs/desmjs';

/**
 * Displays the short details of a MsgRemovePostAttachment within a list.
 * @constructor
 */
const MsgRemovePostAttachmentListItem: MessageListItemComponent<
  MsgRemovePostAttachmentEncodeObject
> = ({ message, date }) => {
  const { t } = useTranslation('messages.posts');
  const { t: tSubspaces } = useTranslation('messages.subspaces');

  return (
    <BaseMessageListItem
      icon={msgGeneralIcon}
      date={date}
      renderContent={() => (
        <View>
          <Typography.Body1>
            {t('remove post attachment')} {message.value.attachmentId.toString()}
          </Typography.Body1>
          <Typography.Caption>
            {tSubspaces('subspace id')}: {message.value.subspaceId.toString()}
          </Typography.Caption>
          <Typography.Caption>
            {t('post id')}: {message.value.postId.toString()}
          </Typography.Caption>
        </View>
      )}
    />
  );
};

export default MsgRemovePostAttachmentListItem;
