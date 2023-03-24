import React from 'react';
import { useTranslation } from 'react-i18next';
import { msgGeneralIcon } from 'assets/images';
import { View } from 'react-native';
import Typography from 'components/Typography';
import BaseMessageListItem from 'components/Messages/BaseMessage/BaseMessageListItem';
import { MessageListItemComponent } from 'components/Messages/BaseMessage';
import { MsgRemoveRegisteredReactionEncodeObject } from '@desmoslabs/desmjs';

/**
 * Displays the short details of a MsgRemoveRegisteredReaction within a list.
 * @constructor
 */
const MsgRemoveRegisteredReactionListItem: MessageListItemComponent<
  MsgRemoveRegisteredReactionEncodeObject
> = ({ message, date }) => {
  const { t } = useTranslation('messages.reactions');
  const { t: tSubspaces } = useTranslation('messages.subspaces');

  return (
    <BaseMessageListItem
      icon={msgGeneralIcon}
      date={date}
      renderContent={() => (
        <View>
          <Typography.Body1>
            {t('remove registered reaction')} {message.value.registeredReactionId.toString()}
          </Typography.Body1>
          <Typography.Caption>
            {tSubspaces('subspace id')}: {message.value.subspaceId.toString()}
          </Typography.Caption>
        </View>
      )}
    />
  );
};

export default MsgRemoveRegisteredReactionListItem;
