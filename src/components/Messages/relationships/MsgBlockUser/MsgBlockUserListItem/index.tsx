import { MessageListItemComponent } from 'components/Messages/BaseMessage';
import React from 'react';
import BaseMessageListItem from 'components/Messages/BaseMessage/BaseMessageListItem';
import { msgGeneralIcon } from 'assets/images';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Typography from 'components/Typography';
import { MsgBlockUserEncodeObject } from '@desmoslabs/desmjs';

const MsgBlockUserListItem: MessageListItemComponent<MsgBlockUserEncodeObject> = ({
  date,
  message,
}) => {
  const { t } = useTranslation('messages.profiles');
  const renderContent = React.useCallback(
    () => (
      <View>
        <Typography.Body>{t('block user')}</Typography.Body>
        <Typography.Caption numberOfLines={1} ellipsizeMode="middle">
          {t('blocked')}: {message.value.blocked}
        </Typography.Caption>
      </View>
    ),
    [message.value.blocked, t],
  );

  return <BaseMessageListItem date={date} icon={msgGeneralIcon} renderContent={renderContent} />;
};

export default MsgBlockUserListItem;
