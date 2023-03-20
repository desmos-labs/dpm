import { MessageListItemComponentProps } from 'components/Messages/BaseMessage';
import { MsgAcceptDTagTransferRequestEncodeObject } from '@desmoslabs/desmjs';
import { useTranslation } from 'react-i18next';
import React from 'react';
import BaseMessageListItem from 'components/Messages/BaseMessage/BaseMessageListItem';
import { msgGeneralIcon } from 'assets/images';
import { View } from 'react-native';
import Typography from 'components/Typography';

type MsgAcceptDtagTransferListItemProps =
  MessageListItemComponentProps<MsgAcceptDTagTransferRequestEncodeObject>;

const MsgAcceptDtagTransferListItem: React.FC<MsgAcceptDtagTransferListItemProps> = ({
  date,
  message,
}) => {
  const { t } = useTranslation('messages.profiles');
  const renderContent = React.useCallback(
    () => (
      <View>
        <Typography.Body>{t('accept dtag transfer')}</Typography.Body>
        <Typography.Caption numberOfLines={1} ellipsizeMode="middle">
          {t('new dtag')}: {message.value.newDtag}
        </Typography.Caption>
      </View>
    ),
    [message.value.newDtag, t],
  );

  return <BaseMessageListItem date={date} icon={msgGeneralIcon} renderContent={renderContent} />;
};

export default MsgAcceptDtagTransferListItem;
