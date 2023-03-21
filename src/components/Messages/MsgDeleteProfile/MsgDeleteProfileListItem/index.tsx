import React from 'react';
import { MsgDeleteProfileEncodeObject } from '@desmoslabs/desmjs';
import { useTranslation } from 'react-i18next';
import { msgGeneralIcon } from 'assets/images';
import BaseMessageListItem from 'components/Messages/BaseMessage/BaseMessageListItem';
import { MessageListItemComponentProps } from 'components/Messages/BaseMessage';
import { View } from 'react-native';
import Typography from 'components/Typography';

export type MsgDeleteProfileListItemProps =
  MessageListItemComponentProps<MsgDeleteProfileEncodeObject>;

/**
 * Displays the full details of a MsgLinkChainAccount.
 * @constructor
 */
const MsgDeleteProfileListItem = (props: MsgDeleteProfileListItemProps) => {
  const { t } = useTranslation('messages.profiles');

  const { date } = props;

  return (
    <BaseMessageListItem
      icon={msgGeneralIcon}
      date={date}
      renderContent={() => (
        <View>
          <Typography.Body1>{t('tx type delete profile')}</Typography.Body1>
        </View>
      )}
    />
  );
};

export default MsgDeleteProfileListItem;
