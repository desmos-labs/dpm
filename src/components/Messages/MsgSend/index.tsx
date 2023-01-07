import { MsgSendEncodeObject } from '@cosmjs/stargate';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { convertCoin } from '@desmoslabs/desmjs';
import { View } from 'react-native';
import Typography from 'components/Typography';
import { formatCoins } from 'lib/FormatUtils';
import { useCurrentChainInfo } from '@recoil/settings';
import BaseMessage from '../BaseMessage';
import useStyles from './useStyles';

export type DetailsProps = {
  message: MsgSendEncodeObject['value'];
};

export type ListItemProps = {
  message: MsgSendEncodeObject['value'];
  date: Date;
};

namespace MsgSend {
  /**
   * Displays the short details of a MsgSend within a list.
   * @constructor
   */
  export const ListItem: React.FC<ListItemProps> = ({ message, date }) => {
    const { t } = useTranslation();
    const currentChainInfo = useCurrentChainInfo();
    const styles = useStyles();

    const tokenSent = useMemo(() => {
      const totals =
        message.amount?.reduce((previousValue, currentValue) => {
          const prev = { ...previousValue };
          if (previousValue[currentValue.denom] === undefined) {
            prev[currentValue.denom] = parseFloat(currentValue.amount);
          } else {
            prev[currentValue.denom] += parseFloat(currentValue.amount);
          }
          return prev;
        }, {} as Record<string, number>) ?? {};
      return Object.keys(totals)
        .map((denom) => {
          const amount = totals[denom];
          return convertCoin(
            {
              amount: amount.toString(),
              denom,
            },
            6,
            currentChainInfo.currencies,
          );
        })
        .filter((coin) => coin !== null)
        .map((coin) => `${coin!.amount} ${coin!.denom.toUpperCase()}`)
        .join('\n');
    }, [currentChainInfo.currencies, message.amount]);

    return (
      <BaseMessage.ListItem
        icon={require('assets/images/messages/send.png')}
        date={date}
        renderContent={() => (
          <View>
            <Typography.Body1>
              {t('send')} {tokenSent}
            </Typography.Body1>
            <View style={styles.toAddress}>
              <Typography.Caption>
                {t('to')} {message.toAddress}
              </Typography.Caption>
            </View>
          </View>
        )}
      />
    );
  };

  /**
   * Displays the full details of a MsgSend.
   * @constructor
   */
  export const Details: React.FC<DetailsProps> = ({ message }) => {
    const { t } = useTranslation();
    const chainInfo = useCurrentChainInfo();
    const convertedAmount = useMemo(
      () => formatCoins(chainInfo, message.amount),
      [message.amount, chainInfo],
    );

    return (
      <BaseMessage.Details
        icon={require('assets/images/messages/send.png')}
        iconSubtitle={convertedAmount}
        fields={[
          {
            label: t('from'),
            value: message.fromAddress ?? '',
          },
          {
            label: t('to'),
            value: message.toAddress ?? '',
          },
          {
            label: t('amount'),
            value: convertedAmount,
          },
        ]}
      />
    );
  };
}

export default MsgSend;
