import React from 'react';
import { useTranslation } from 'react-i18next';
import { msgGeneralIcon } from 'assets/images';
import { View } from 'react-native';
import Typography from 'components/Typography';
import BaseMessageListItem from 'components/Messages/BaseMessage/BaseMessageListItem';
import { MessageListItemComponent } from 'components/Messages/BaseMessage';
import { MsgDeleteSubspaceEncodeObject } from '@desmoslabs/desmjs';

/**
 * Displays the short details of a MsgDeleteSubspace within a list.
 * @constructor
 */
const MsgDeleteSubspaceListItem: MessageListItemComponent<MsgDeleteSubspaceEncodeObject> = ({
  message,
  date,
}) => {
  const { t } = useTranslation('messages.subspaces');

  return (
    <BaseMessageListItem
      icon={msgGeneralIcon}
      date={date}
      renderContent={() => (
        <View>
          <Typography.Body1>{t('delete subspace')}</Typography.Body1>
          <Typography.Caption>
            {t('subspace id')}: {message.value.subspaceId.toString()}
          </Typography.Caption>
        </View>
      )}
    />
  );
};

export default MsgDeleteSubspaceListItem;
