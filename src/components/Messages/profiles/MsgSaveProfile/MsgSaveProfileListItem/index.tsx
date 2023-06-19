import { MsgSaveProfileEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { msgGeneralIcon } from 'assets/images';
import { View } from 'react-native';
import Typography from 'components/Typography';
import BaseMessageListItem from 'components/Messages/BaseMessage/BaseMessageListItem';
import { MessageListItemComponent } from 'components/Messages/BaseMessage';

/**
 * Displays the short details of a MsgSaveProfile within a list.
 * @constructor
 */
const MsgSaveProfileListItem: MessageListItemComponent<MsgSaveProfileEncodeObject> = ({ date }) => {
  const { t } = useTranslation('messages.profiles');
  return (
    <BaseMessageListItem
      icon={msgGeneralIcon}
      date={date}
      renderContent={() => (
        <View>
          <Typography.Body1>{t('save profile')}</Typography.Body1>
        </View>
      )}
    />
  );
};

export default MsgSaveProfileListItem;
