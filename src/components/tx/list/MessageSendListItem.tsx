import { convertCoin, MsgSendEncodeObject } from '@desmoslabs/sdk-core';
import { useCurrentChainInfo } from '@desmoslabs/sdk-react';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Typography } from '../../typography';
import { BaseMessageListItem } from './BaseMessageListItem';

export type Props = {
  encodeObject: MsgSendEncodeObject;
  date: Date;
};

export const MessageSendListItem: React.FC<Props> = (props) => {
  const { encodeObject, date } = props;
  const { t } = useTranslation();
  const currentChainInfo = useCurrentChainInfo();

  const tokenSent = useMemo(() => {
    const totals =
      props.encodeObject.value.amount?.reduce((previousValue, currentValue) => {
        if (previousValue[currentValue.denom] === undefined) {
          previousValue[currentValue.denom] = parseFloat(currentValue.amount);
        } else {
          previousValue[currentValue.denom] += parseFloat(currentValue.amount);
        }
        return previousValue;
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
  }, [currentChainInfo.denomUnits, props.encodeObject.value.amount]);

  return (
    <BaseMessageListItem
      icon={require('../../../assets/tx-icons/send.png')}
      date={date}
      renderContent={() => (
        <View>
          <Typography.Body1>
            {t('send')} {tokenSent}
          </Typography.Body1>
          <Typography.Caption>
            {t('to')} {encodeObject.value.toAddress}
          </Typography.Caption>
        </View>
      )}
    />
  );
};
