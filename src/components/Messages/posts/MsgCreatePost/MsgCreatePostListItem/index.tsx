import { MsgCreatePostEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { msgGeneralIcon } from 'assets/images';
import { View } from 'react-native';
import Typography from 'components/Typography';
import BaseMessageListItem from 'components/Messages/BaseMessage/BaseMessageListItem';
import { MessageListItemComponent } from 'components/Messages/BaseMessage';

/**
 * Displays the short details of a MsgCreatePost within a list.
 * @constructor
 */
const MsgCreatePostListItem: MessageListItemComponent<MsgCreatePostEncodeObject> = ({
  message,
  date,
}) => {
  const { t } = useTranslation('messages.posts');
  const { t: tSubspaces } = useTranslation('messages.subspaces');

  return (
    <BaseMessageListItem
      icon={msgGeneralIcon}
      date={date}
      renderContent={() => (
        <View>
          <Typography.Body1>{t('create post')}</Typography.Body1>
          <Typography.Caption>
            {tSubspaces('subspace id')}: {message.value.subspaceId.toString()}
          </Typography.Caption>
        </View>
      )}
    />
  );
};

export default MsgCreatePostListItem;
