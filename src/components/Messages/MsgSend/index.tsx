import { MsgSendEncodeObject } from '@cosmjs/stargate';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {Coin} from '@desmoslabs/desmjs-types/cosmos/base/v1beta1/coin';
import {ChainInfo, convertCoin} from '@desmoslabs/desmjs';
import {View} from 'react-native';
import useCurrentChainInfo from 'hooks/desmosclient/useCurrentChainInfo';
import Typography from 'components/Typography';
import BaseMessage from '../BaseMessage';

export type DetailsProps = {
  message: MsgSendEncodeObject['value'];
};

export type ListItemProps = {
  message: MsgSendEncodeObject['value'];
  date: Date;
};

function formatCoins(amount: Coin[] | undefined, chainInfo: ChainInfo) {
  if (!amount) {
    return '';
  }
  return amount
    .map((coinAmount) => {
      const converted = convertCoin(coinAmount, 6, chainInfo.currencies);
      if (converted !== null) {
        return `${converted.amount} ${converted.denom.toUpperCase()}`;
      }
      return `${coinAmount.amount} ${coinAmount.denom}`;
    })
    .join('\n');
}

namespace MsgSend {
  /**
   * Displays the short details of a MsgSend within a list.
   * @constructor
   */
  export const ListItem: React.FC<ListItemProps> = ({ message, date }) => {
    const { t } = useTranslation();
    const currentChainInfo = useCurrentChainInfo();

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
        icon={require('assets/tx-icons/send.png')}
        date={date}
        renderContent={() => (
          <View>
            <Typography.Body1>
              {t('send')} {tokenSent}
            </Typography.Body1>
            <View style={{ flexDirection: 'row', flexShrink: 1 }}>
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
  export const Details: React.FC<DetailsProps> = ({message}) => {
    const {t} = useTranslation();
    const chainInfo = useCurrentChainInfo();
    const convertedAmount = useMemo(() => formatCoins(message.amount, chainInfo), [message.amount, chainInfo]);

    return (
      <BaseMessage.Details
        icon={require('assets/tx-icons/send.png')}
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
