import { MessageListItemComponentProps } from 'components/Messages/BaseMessage';
import React from 'react';
import BaseMessageListItem from 'components/Messages/BaseMessage/BaseMessageListItem';
import { msgGeneralIcon } from 'assets/images';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Typography from 'components/Typography';
import { MsgCreateRelationshipEncodeObject } from '@desmoslabs/desmjs';

type MsgCreateRelationshipListItemProps =
  MessageListItemComponentProps<MsgCreateRelationshipEncodeObject>;

const MsgCreateRelationshipListItem: React.FC<MsgCreateRelationshipListItemProps> = ({
  date,
  message,
}) => {
  const { t } = useTranslation('messages.profiles');
  const renderContent = React.useCallback(
    () => (
      <View>
        <Typography.Body>{t('create relationship')}</Typography.Body>
        <Typography.Caption numberOfLines={1} ellipsizeMode="middle">
          {t('common:from')} {message.value.signer}
        </Typography.Caption>
        <Typography.Caption numberOfLines={1} ellipsizeMode="middle">
          {t('common:to')} {message.value.counterparty}
        </Typography.Caption>
      </View>
    ),
    [message.value.counterparty, message.value.signer, t],
  );

  return <BaseMessageListItem date={date} icon={msgGeneralIcon} renderContent={renderContent} />;
};

export default MsgCreateRelationshipListItem;
