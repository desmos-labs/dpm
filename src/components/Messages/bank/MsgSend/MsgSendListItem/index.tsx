import { MsgSendEncodeObject } from '@cosmjs/stargate';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { formatCoins } from 'lib/FormatUtils';
import { msgSendIcon } from 'assets/images';
import { View } from 'react-native';
import Typography from 'components/Typography';
import BaseMessageListItem from 'components/Messages/BaseMessage/BaseMessageListItem';
import { MessageListItemComponent } from 'components/Messages/BaseMessage';
import useStyles from '../useStyles';

/**
 * Displays the short details of a MsgSend within a list.
 */
const MsgSendListItem: MessageListItemComponent<MsgSendEncodeObject> = ({ message, date }) => {
  const { t } = useTranslation('messages.bank');
  const styles = useStyles();
  const { value } = message;

  const tokenSent = useMemo(() => formatCoins(value.amount), [value.amount]);
  return (
    <BaseMessageListItem
      icon={msgSendIcon}
      date={date}
      renderContent={() => (
        <View>
          <Typography.Body1>
            {t('common:send')} {tokenSent}
          </Typography.Body1>
          <View style={styles.toAddress}>
            <Typography.Caption numberOfLines={1} ellipsizeMode="middle">
              {t('transaction:to')} {value.toAddress}
            </Typography.Caption>
          </View>
        </View>
      )}
    />
  );
};

export default MsgSendListItem;
