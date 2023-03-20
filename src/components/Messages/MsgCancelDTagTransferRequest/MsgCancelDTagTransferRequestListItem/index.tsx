import { MessageListItemComponentProps } from 'components/Messages/BaseMessage';
import React from 'react';
import BaseMessageListItem from 'components/Messages/BaseMessage/BaseMessageListItem';
import { msgGeneralIcon } from 'assets/images';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Typography from 'components/Typography';
import { MsgCancelDTagTransferRequestEncodeObject } from '@desmoslabs/desmjs';

type MsgCancelDtagTransferListItemProps =
  MessageListItemComponentProps<MsgCancelDTagTransferRequestEncodeObject>;

const MsgCancelDtagTransferListItem: React.FC<MsgCancelDtagTransferListItemProps> = ({
  date,
  message,
}) => {
  const { t } = useTranslation('messages.profiles');
  const renderContent = React.useCallback(
    () => (
      <View>
        <Typography.Body>{t('cancel dtag transfer')}</Typography.Body>
        <Typography.Caption numberOfLines={1} ellipsizeMode="middle">
          {t('common:from')} {message.value.sender}
        </Typography.Caption>
      </View>
    ),
    [message.value.sender, t],
  );

  return <BaseMessageListItem date={date} icon={msgGeneralIcon} renderContent={renderContent} />;
};

export default MsgCancelDtagTransferListItem;
