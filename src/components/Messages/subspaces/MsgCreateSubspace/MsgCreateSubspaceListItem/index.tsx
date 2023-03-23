import { MsgCreateSubspaceEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { msgGeneralIcon } from 'assets/images';
import { View } from 'react-native';
import Typography from 'components/Typography';
import BaseMessageListItem from 'components/Messages/BaseMessage/BaseMessageListItem';

export type MsgCreateSubspaceListItemProps = {
  message: MsgCreateSubspaceEncodeObject;
  date: Date;
};

/**
 * Displays the short details of a MsgCreateSubspace within a list.
 * @constructor
 */
const MsgCreateSubspaceListItem = (props: MsgCreateSubspaceListItemProps) => {
  const { t } = useTranslation('messages.subspaces');
  const { message, date } = props;

  return (
    <BaseMessageListItem
      icon={msgGeneralIcon}
      date={date}
      renderContent={() => (
        <View>
          <Typography.Body1>{t('create subspace')}</Typography.Body1>
          <Typography.Caption>{message.value.name}</Typography.Caption>
        </View>
      )}
    />
  );
};

export default MsgCreateSubspaceListItem;
