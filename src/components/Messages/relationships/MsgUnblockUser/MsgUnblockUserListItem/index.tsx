import { MessageListItemComponent } from 'components/Messages/BaseMessage';
import React from 'react';
import BaseMessageListItem from 'components/Messages/BaseMessage/BaseMessageListItem';
import { msgGeneralIcon } from 'assets/images';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Typography from 'components/Typography';
import { MsgUnblockUserEncodeObject } from '@desmoslabs/desmjs';

const MsgUnblockUserListItem: MessageListItemComponent<MsgUnblockUserEncodeObject> = ({
  date,
  message,
}) => {
  const { t } = useTranslation('messages.profiles');
  const renderContent = React.useCallback(
    () => (
      <View>
        <Typography.Body>{t('unblock user')}</Typography.Body>
        <Typography.Caption numberOfLines={1} ellipsizeMode="middle">
          {t('unblocked')}: {message.value.blocked}
        </Typography.Caption>
      </View>
    ),
    [message.value.blocked, t],
  );

  return <BaseMessageListItem date={date} icon={msgGeneralIcon} renderContent={renderContent} />;
};

export default MsgUnblockUserListItem;
