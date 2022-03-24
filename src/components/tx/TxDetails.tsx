import { StdFee } from '@cosmjs/amino';
import { AminoMsg } from '@cosmjs/amino/build/signdoc';
import { EncodeObject } from '@cosmjs/proto-signing';
import { convertCoin } from '@desmoslabs/sdk-core';
import { useCurrentChainInfo } from '@desmoslabs/sdk-react';
import { Any } from 'cosmjs-types/google/protobuf/any';
import { format } from 'date-fns';
import Long from 'long';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Divider, LabeledValue } from '../index';
import { TxMessage } from './TxMessage';

export type Props = {
  messages: readonly (EncodeObject | Any | AminoMsg)[];
  fee?: StdFee;
  memo?: string;
  success?: boolean;
  dateTime?: Date;
  style?: StyleProp<ViewStyle>;
};

export const TxDetails: React.FC<Props> = (props) => {
  const { memo, messages, fee, success, dateTime } = props;
  const { t } = useTranslation();
  const chainInfo = useCurrentChainInfo();

  const txFex = useMemo(() => {
    if (fee !== undefined && fee.amount.length > 0) {
      const feeAmount = fee.amount
        .filter((coin) => coin.denom === chainInfo.coinDenom)
        .map((coin) => Long.fromString(coin.amount))
        .reduce((previousValue, currentValue) => previousValue.add(currentValue), Long.ZERO);

      const convertedFee = convertCoin(
        {
          denom: chainInfo.coinDenom,
          amount: feeAmount.toString(),
        },
        6,
        chainInfo.denomUnits
      );

      if (convertedFee === null) {
        return `${feeAmount.toString(10)} ${chainInfo.coinDenom}`;
      }
      return `${convertedFee.amount} ${convertedFee.denom.toUpperCase()}`;
    }
    return '0';
  }, [chainInfo.coinDenom, chainInfo.denomUnits, fee]);

  return (
    <View style={styles.root} onStartShouldSetResponder={() => true}>
      <ScrollView style={props.style}>
        {messages.map((msg: EncodeObject | Any | AminoMsg, i: number) => (
          <View key={`view_${i}`}>
            <TxMessage key={`msg_${i}`} message={msg} />
            <Divider key={`divider_${i}`} />
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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
