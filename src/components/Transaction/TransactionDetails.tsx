import { EncodeObject } from '@cosmjs/proto-signing';
import { convertCoin } from '@desmoslabs/desmjs';
import { format } from 'date-fns';
import Long from 'long';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import {StdFee} from "@cosmjs/amino";
import useCurrentChainInfo from '../../hooks/desmosclient/useCurrentChainInfo';
import { Divider, LabeledValue } from '../index';
import { MessageDetails } from './messages/MessageDetails';

export type Props = {
  messages: readonly EncodeObject[];
  fee?: StdFee;
  memo?: string;
  success?: boolean;
  dateTime?: Date;
  style?: StyleProp<ViewStyle>;
};

export const TransactionDetails: React.FC<Props> = (props) => {
  const { memo, messages, fee, success, dateTime, style } = props;
  const { t } = useTranslation();
  const chainInfo = useCurrentChainInfo();

  const txFex = useMemo(() => {
    if (fee !== undefined && fee.amount.length > 0) {
      const feeAmount = fee.amount
        .filter((coin) => coin.denom === chainInfo.stakingDenom)
        .map((coin) => Long.fromString(coin.amount))
        .reduce((previousValue, currentValue) => previousValue.add(currentValue), Long.ZERO);

      const convertedFee = convertCoin(
        {
          denom: chainInfo.stakingDenom,
          amount: feeAmount.toString(),
        },
        6,
        chainInfo.denomUnits
      );

      if (convertedFee === null) {
        return `${feeAmount.toString(10)} ${chainInfo.stakingDenom}`;
      }
      return `${convertedFee.amount} ${convertedFee.denom.toUpperCase()}`;
    }
    return '0';
  }, [chainInfo.stakingDenom, chainInfo.denomUnits, fee]);

  return (
    <View style={styles.root}>
      <ScrollView style={style}>
        <Pressable>
          {messages.map((msg: EncodeObject, i: number) => (
            <View key={`view_${i * 2}`}>
              <MessageDetails key={`msg_${i * 2}`} message={msg} />
              <Divider key={`divider_${i * 2}`} />
            </View>
          ))}
          <LabeledValue label={t('fee')} value={txFex} />
          <Divider />
          {dateTime && (
            <>
              <LabeledValue label={t('time')} value={format(dateTime, 'dd MMM yyyy, HH:mm:ss')} />
              <Divider />
            </>
          )}
          {success !== undefined && (
            <>
              <LabeledValue label={t('status')} value={success ? t('success') : t('fail')} />
              <Divider />
            </>
          )}
          <LabeledValue label={t('memo')} value={(memo?.length ?? 0) > 0 ? memo : 'N/A'} />
          <Divider />
        </Pressable>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
