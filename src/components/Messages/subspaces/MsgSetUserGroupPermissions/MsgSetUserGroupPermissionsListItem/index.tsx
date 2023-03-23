import { MsgSetUserGroupPermissionsEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { msgGeneralIcon } from 'assets/images';
import { View } from 'react-native';
import Typography from 'components/Typography';
import BaseMessageListItem from 'components/Messages/BaseMessage/BaseMessageListItem';
import { MessageListItemComponent } from 'components/Messages/BaseMessage';

/**
 * Displays the short details of a MsgSetUserGroupPermissions within a list.
 * @constructor
 */
const MsgSetUserGroupPermissionsListItem: MessageListItemComponent<
  MsgSetUserGroupPermissionsEncodeObject
> = ({ message, date }) => {
  const { t } = useTranslation('messages.subspaces');

  return (
    <BaseMessageListItem
      icon={msgGeneralIcon}
      date={date}
      renderContent={() => (
        <View>
          <Typography.Body1>{t('set user group permissions')}</Typography.Body1>
          <Typography.Caption>
            {t('subspace id')}: {message.value.subspaceId.toString()}
          </Typography.Caption>
          <Typography.Caption>
            {t('group id')}: {message.value.groupId.toString()}
          </Typography.Caption>
        </View>
      )}
    />
  );
};

export default MsgSetUserGroupPermissionsListItem;
