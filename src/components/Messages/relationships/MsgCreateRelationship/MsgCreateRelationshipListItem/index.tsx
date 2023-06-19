import { MessageListItemComponent } from 'components/Messages/BaseMessage';
import React from 'react';
import BaseMessageListItem from 'components/Messages/BaseMessage/BaseMessageListItem';
import { msgGeneralIcon } from 'assets/images';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Typography from 'components/Typography';
import { MsgCreateRelationshipEncodeObject } from '@desmoslabs/desmjs';

const MsgCreateRelationshipListItem: MessageListItemComponent<
  MsgCreateRelationshipEncodeObject
> = ({ date, message }) => {
  const { t } = useTranslation('messages.relationships');
  const renderContent = React.useCallback(
    () => (
      <View>
        <Typography.Body>{t('create relationship')}</Typography.Body>
        <Typography.Caption numberOfLines={1} ellipsizeMode="middle">
          {t('transaction:from')} {message.value.signer}
        </Typography.Caption>
        <Typography.Caption numberOfLines={1} ellipsizeMode="middle">
          {t('transaction:to')} {message.value.counterparty}
        </Typography.Caption>
      </View>
    ),
    [message.value.counterparty, message.value.signer, t],
  );

  return <BaseMessageListItem date={date} icon={msgGeneralIcon} renderContent={renderContent} />;
};

export default MsgCreateRelationshipListItem;
