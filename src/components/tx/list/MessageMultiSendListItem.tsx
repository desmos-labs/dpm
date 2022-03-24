import { convertCoin } from '@desmoslabs/sdk-core';
import { useCurrentChainInfo } from '@desmoslabs/sdk-react';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { MsgMultiSendEncodeObject } from '../../../types/encodeobject';
import { Typography } from '../../typography';
import { BaseMessageListItem } from './BaseMessageListItem';

export type Props = {
  encodeObject: MsgMultiSendEncodeObject;
  date: Date;
};

export const MessageMultiSendListItem: React.FC<Props> = (props) => {
  const { encodeObject, date } = props;
  const { t } = useTranslation();
  const currentChainInfo = useCurrentChainInfo();

  const tokenSent = useMemo(
    () =>
      encodeObject.value.inputs
        ?.map((input) =>
          input.coins
            .map((c) => convertCoin(c, 6, currentChainInfo.denomUnits))
            .filter((c) => c !== null)
            .map((c) => `${c?.amount} ${c?.denom.toUpperCase()}`)
            .join(', ')
        )
        .join(', '),
    [currentChainInfo.denomUnits, encodeObject.value.inputs]
  );

  const outputAddresses = useMemo(
    () => encodeObject.value.outputs.map((output) => output.address),
    [encodeObject.value.outputs]
  );

  return (
    <BaseMessageListItem
      icon={require('../../../assets/tx-icons/send.png')}
      date={date}
      renderContent={() => (
        <View>
          <Typography.Body1>
            {t('multi send')} {tokenSent}
          </Typography.Body1>
          <Typography.Caption>{t('to')}</Typography.Caption>
          {outputAddresses.map((address, index) => (
            <Typography.Caption key={index.toString()} numberOfLines={1} ellipsizeMode="middle">
              {address}
            </Typography.Caption>
          ))}
        </View>
      )}
    />
  );
};
