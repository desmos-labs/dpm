import React from 'react';
import { useTranslation } from 'react-i18next';
import { msgGeneralIcon } from 'assets/images';
import { View } from 'react-native';
import Typography from 'components/Typography';
import BaseMessageListItem from 'components/Messages/BaseMessage/BaseMessageListItem';
import { MessageListItemComponent } from 'components/Messages/BaseMessage';
import { MsgAddRegisteredReactionEncodeObject } from '@desmoslabs/desmjs';

/**
 * Displays the short details of a MsgAddRegisteredReaction within a list.
 * @constructor
 */
const MsgAddRegisteredReactionListItem: MessageListItemComponent<
  MsgAddRegisteredReactionEncodeObject
> = ({ message, date }) => {
  const { t } = useTranslation('messages.reactions');
  const { t: tSubspaces } = useTranslation('messages.subspaces');

  return (
    <BaseMessageListItem
      icon={msgGeneralIcon}
      date={date}
      renderContent={() => (
        <View>
          <Typography.Body1>{t('add registered reaction')}</Typography.Body1>
          <Typography.Caption>
            {tSubspaces('subspace id')}: {message.value.subspaceId.toString()}
          </Typography.Caption>
          <Typography.Caption>
            {t('display value')}: {message.value.displayValue}
          </Typography.Caption>
        </View>
      )}
    />
  );
};

export default MsgAddRegisteredReactionListItem;
