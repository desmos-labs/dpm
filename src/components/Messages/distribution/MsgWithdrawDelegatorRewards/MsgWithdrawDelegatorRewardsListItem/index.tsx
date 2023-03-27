import { MsgWithdrawDelegatorRewardEncodeObject } from '@cosmjs/stargate';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { msgWithdrawIcon } from 'assets/images';
import { View } from 'react-native';
import Typography from 'components/Typography';
import BaseMessageListItem from 'components/Messages/BaseMessage/BaseMessageListItem';
import { MessageListItemComponent } from 'components/Messages/BaseMessage';
import useStyles from './useStyles';

/**
 * Displays the short details of a MsgWithdrawDelegatorRewards within a list.
 * @constructor
 */
const MsgWithdrawDelegatorRewardsListItem: MessageListItemComponent<
  MsgWithdrawDelegatorRewardEncodeObject
> = ({ message, date }) => {
  const { t } = useTranslation('messages.staking');
  const styles = useStyles();
  const { value } = message;

  return (
    <BaseMessageListItem
      icon={msgWithdrawIcon}
      date={date}
      renderContent={() => (
        <View>
          <Typography.Body1>{t('withdraw rewards')}</Typography.Body1>
          <View style={styles.validatorAddress}>
            <Typography.Caption>
              {t('transaction:from')} {value.validatorAddress}
            </Typography.Caption>
          </View>
        </View>
      )}
    />
  );
};

export default MsgWithdrawDelegatorRewardsListItem;
