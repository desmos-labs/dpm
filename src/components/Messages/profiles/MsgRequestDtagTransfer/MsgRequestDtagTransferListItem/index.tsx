import { MessageListItemComponent } from 'components/Messages/BaseMessage';
import { MsgRequestDTagTransferEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import BaseMessageListItem from 'components/Messages/BaseMessage/BaseMessageListItem';
import { msgGeneralIcon } from 'assets/images';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Typography from 'components/Typography';

const MsgRequestDtagTransferListItem: MessageListItemComponent<
  MsgRequestDTagTransferEncodeObject
> = ({ date, message }) => {
  const { t } = useTranslation('messages.profiles');
  const renderContent = React.useCallback(
    () => (
      <View>
        <Typography.Body>{t('request dtag transfer')}</Typography.Body>
        <Typography.Caption numberOfLines={1} ellipsizeMode="middle">
          {t('transaction:to')} {message.value.receiver}
        </Typography.Caption>
      </View>
    ),
    [message.value.receiver, t],
  );

  return <BaseMessageListItem date={date} icon={msgGeneralIcon} renderContent={renderContent} />;
};

export default MsgRequestDtagTransferListItem;
