import React from 'react';
import { MsgDeleteProfileEncodeObject } from '@desmoslabs/desmjs';
import { useTranslation } from 'react-i18next';
import { msgGeneralIcon } from 'assets/images';
import BaseMessageListItem from 'components/Messages/BaseMessage/BaseMessageListItem';
import { MessageListItemComponent } from 'components/Messages/BaseMessage';
import { View } from 'react-native';
import Typography from 'components/Typography';

/**
 * Displays the full details of a MsgLinkChainAccount.
 * @constructor
 */
const MsgDeleteProfileListItem: MessageListItemComponent<MsgDeleteProfileEncodeObject> = ({
  date,
}) => {
  const { t } = useTranslation('messages.profiles');

  return (
    <BaseMessageListItem
      icon={msgGeneralIcon}
      date={date}
      renderContent={() => (
        <View>
          <Typography.Body1>{t('delete profile')}</Typography.Body1>
        </View>
      )}
    />
  );
};

export default MsgDeleteProfileListItem;
