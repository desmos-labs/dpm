import { MsgUnlinkChainAccountEncodeObject } from '@desmoslabs/desmjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { msgGeneralIcon } from 'assets/images';
import { View } from 'react-native';
import Typography from 'components/Typography';
import BaseMessageListItem from 'components/Messages/BaseMessage/BaseMessageListItem';
import { MessageListItemComponent } from 'components/Messages/BaseMessage';
import useStyles from './useStyles';

/**
 * Displays the short details of a MsgUnlinkChainAccount within a list.
 * @constructor
 */
const MsgUnlinkChainAccountListItem: MessageListItemComponent<
  MsgUnlinkChainAccountEncodeObject
> = ({ message, date }) => {
  const { t } = useTranslation('messages.profiles');
  const styles = useStyles();
  const { value } = message;

  return (
    <BaseMessageListItem
      icon={msgGeneralIcon}
      date={date}
      renderContent={() => (
        <View>
          <Typography.Body1>{t('tx type unlink chain account')}</Typography.Body1>
          <View style={styles.target}>
            <Typography.Caption numberOfLines={1} ellipsizeMode="middle">
              {value.target}
            </Typography.Caption>
          </View>
        </View>
      )}
    />
  );
};

export default MsgUnlinkChainAccountListItem;
