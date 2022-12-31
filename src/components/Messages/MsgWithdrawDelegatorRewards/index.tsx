import { MsgWithdrawDelegatorRewardEncodeObject } from '@cosmjs/stargate';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Typography from 'components/Typography';
import BaseMessage from '../BaseMessage';
import useStyles from './useStyles';

export type DetailsProps = {
  message?: MsgWithdrawDelegatorRewardEncodeObject['value'];
};

export type ListItemProps = {
  message: MsgWithdrawDelegatorRewardEncodeObject['value'];
  date: Date;
};

namespace MsgWithdrawDelegatorRewards {
  /**
   * Displays the short details of a MsgWithdrawDelegatorRewards within a list.
   * @constructor
   */
  export const ListItem: React.FC<ListItemProps> = ({ message, date }) => {
    const { t } = useTranslation();
    const styles = useStyles();

    return (
      <BaseMessage.ListItem
        icon={require('assets/tx-icons/withdraw.png')}
        date={date}
        renderContent={() => (
          <View>
            <Typography.Body1>{t('withdraw rewards')}</Typography.Body1>
            <View style={styles.validatorAddress}>
              <Typography.Caption>
                {t('from')} {message.validatorAddress}
              </Typography.Caption>
            </View>
          </View>
        )}
      />
    );
  };

  /**
   * Displays the full details of a MsgWithdrawDelegatorRewards.
   * @constructor
   */
  export const Details: React.FC<DetailsProps> = ({message}) => {
    const { t } = useTranslation();

    return (
      <BaseMessage.Details
        icon={require('assets/tx-icons/withdraw.png')}
        iconSubtitle={t('withdraw rewards')}
        fields={[
          {
            label: t('from'),
            value: message?.validatorAddress,
          },
        ]}
      />
    );
  };
}

export default MsgWithdrawDelegatorRewards;
