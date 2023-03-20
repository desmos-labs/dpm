import { MessageListItemComponentProps } from 'components/Messages/BaseMessage';
import React from 'react';
import BaseMessageListItem from 'components/Messages/BaseMessage/BaseMessageListItem';
import { msgGeneralIcon } from 'assets/images';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Typography from 'components/Typography';
import { MsgUnlinkApplicationEncodeObject } from '@desmoslabs/desmjs';

type MsgUnlinkApplicationListItemProps =
  MessageListItemComponentProps<MsgUnlinkApplicationEncodeObject>;

const MsgUnlinkApplicationListItem: React.FC<MsgUnlinkApplicationListItemProps> = ({
  date,
  message,
}) => {
  const { t } = useTranslation('messages.profiles');
  const renderContent = React.useCallback(
    () => (
      <View>
        <Typography.Body>{t('unlink application')}</Typography.Body>
        <Typography.Caption numberOfLines={1} ellipsizeMode="middle">
          {t('application')}: {message.value.application}
        </Typography.Caption>
        <Typography.Caption numberOfLines={1} ellipsizeMode="middle">
          {t('username')}: {message.value.username}
        </Typography.Caption>
      </View>
    ),
    [message, t],
  );

  return <BaseMessageListItem date={date} icon={msgGeneralIcon} renderContent={renderContent} />;
};

export default MsgUnlinkApplicationListItem;
