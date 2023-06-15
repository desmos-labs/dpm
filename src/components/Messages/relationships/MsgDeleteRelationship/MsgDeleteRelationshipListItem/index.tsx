import { MessageListItemComponent } from 'components/Messages/BaseMessage';
import React from 'react';
import BaseMessageListItem from 'components/Messages/BaseMessage/BaseMessageListItem';
import { msgGeneralIcon } from 'assets/images';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Typography from 'components/Typography';
import { MsgDeleteRelationshipEncodeObject } from '@desmoslabs/desmjs';

const MsgDeleteRelationshipListItem: MessageListItemComponent<
  MsgDeleteRelationshipEncodeObject
> = ({ date, message }) => {
  const { t } = useTranslation('messages.relationships');
  const renderContent = React.useCallback(
    () => (
      <View>
        <Typography.Body>{t('delete relationship')}</Typography.Body>
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

export default MsgDeleteRelationshipListItem;
