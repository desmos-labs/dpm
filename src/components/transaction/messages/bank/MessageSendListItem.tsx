import { MsgSendEncodeObject } from '@cosmjs/stargate';
import { convertCoin } from '@desmoslabs/desmjs';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import useCurrentChainInfo from '../../../../hooks/desmosclient/useCurrentChainInfo';
import { Typography } from '../../../typography';
import { BaseMessageListItem } from '../BaseMessageListItem';

export type Props = {
  message: MsgSendEncodeObject["value"];
  date: Date;
};

/**
 * Displays the short details of a MsgSend within a list.
 * @constructor
 */
export const MessageSendListItem: React.FC<Props> = ({ message, date }) => {
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
          currentChainInfo.denomUnits
        );
      })
      .filter((coin) => coin !== null)
      .map((coin) => `${coin!.amount} ${coin!.denom.toUpperCase()}`)
      .join('\n');
  }, [currentChainInfo.denomUnits, message.amount]);

  return (
    <BaseMessageListItem
      icon={require('../../../../assets/tx-icons/send.png')}
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
