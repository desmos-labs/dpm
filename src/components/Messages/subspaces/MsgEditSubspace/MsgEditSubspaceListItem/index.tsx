import { MsgEditSubspaceEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { msgGeneralIcon } from 'assets/images';
import { View } from 'react-native';
import Typography from 'components/Typography';
import BaseMessageListItem from 'components/Messages/BaseMessage/BaseMessageListItem';

export type MsgEditSubspaceListItemProps = {
  message: MsgEditSubspaceEncodeObject;
  date: Date;
};

/**
 * Displays the short details of a MsgEditSubspace within a list.
 * @constructor
 */
const MsgEditSubspaceListItem = (props: MsgEditSubspaceListItemProps) => {
  const { t } = useTranslation('messages.subspaces');
  const { message, date } = props;

  return (
    <BaseMessageListItem
      icon={msgGeneralIcon}
      date={date}
      renderContent={() => (
        <View>
          <Typography.Body1>{t('edit subspace')}</Typography.Body1>
          <Typography.Caption>
            {t('subspace id')}: {message.value.subspaceId.toString()}
          </Typography.Caption>
        </View>
      )}
    />
  );
};

export default MsgEditSubspaceListItem;
