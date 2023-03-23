import { MsgMoveUserGroupEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { msgGeneralIcon } from 'assets/images';
import { View } from 'react-native';
import Typography from 'components/Typography';
import BaseMessageListItem from 'components/Messages/BaseMessage/BaseMessageListItem';
import { MessageListItemComponent } from 'components/Messages/BaseMessage';

/**
 * Displays the short details of a MsgMoveUserGroup within a list.
 * @constructor
 */
const MsgMoveUserGroupListItem: MessageListItemComponent<MsgMoveUserGroupEncodeObject> = ({
  message,
  date,
}) => {
  const { t } = useTranslation('messages.subspaces');

  return (
    <BaseMessageListItem
      icon={msgGeneralIcon}
      date={date}
      renderContent={() => (
        <View>
          <Typography.Body1>
            {t('move user group')} {message.value.groupId.toString()}
          </Typography.Body1>
          <Typography.Caption>
            {t('subspace id')}: {message.value.subspaceId.toString()}
          </Typography.Caption>
          <Typography.Caption>
            {t('new section id')}: {message.value.newSectionId.toString()}
          </Typography.Caption>
        </View>
      )}
    />
  );
};

export default MsgMoveUserGroupListItem;
