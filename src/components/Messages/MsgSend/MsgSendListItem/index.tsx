import { MsgSendEncodeObject } from '@cosmjs/stargate';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import useStyles from 'components/Messages/MsgSend/useStyles';
import { formatCoins } from 'lib/FormatUtils';
import { msgSendIcon } from 'assets/images';
import { View } from 'react-native';
import Typography from 'components/Typography';
import BaseMessageListItem from 'components/Messages/BaseMessage/BaseMessageListItem';

export type MsgSendListItemProps = {
  message: MsgSendEncodeObject['value'];
  date: Date;
};

/**
 * Displays the short details of a MsgSend within a list.
 */
const MsgSendListItem = (props: MsgSendListItemProps) => {
  const { t } = useTranslation('sendTokens');
  const styles = useStyles();
  const { message, date } = props;

  const tokenSent = useMemo(() => formatCoins(message.amount), [message.amount]);
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
              {t('to')} {message.toAddress}
            </Typography.Caption>
          </View>
        </View>
      )}
    />
  );
};

export default MsgSendListItem;
