import { convertCoin } from '@desmoslabs/desmjs';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import useCurrentChainInfo from '../../../../hooks/desmosclient/useCurrentChainInfo';
import { MsgMultiSendEncodeObject } from '../../../../types/encodeobject';
import { Typography } from '../../../typography';
import { BaseMessageListItem } from '../BaseMessageListItem';

export type Props = {
  message: MsgMultiSendEncodeObject["value"];
  date: Date;
};

/**
 * Displays the short details of a MsgMultiSend within a list.
 * @constructor
 */
export const MessageMultiSendListItem: React.FC<Props> = ({ message, date }) => {
  const { t } = useTranslation();
  const currentChainInfo = useCurrentChainInfo();

  const tokenSent = useMemo(
    () =>
      message.inputs
        ?.map((input) =>
          input.coins
            .map((c) => convertCoin(c, 6, currentChainInfo.denomUnits))
            .filter((c) => c !== null)
            .map((c) => `${c?.amount} ${c?.denom.toUpperCase()}`)
            .join(', ')
        )
        .join(', '),
    [currentChainInfo.denomUnits, message.inputs]
  );

  const outputAddresses = useMemo(
    () => message.outputs.map((output) => output.address),
    [message.outputs]
  );

  return (
    <BaseMessageListItem
      icon={require('../../../../assets/tx-icons/send.png')}
      date={date}
      renderContent={() => (
        <View>
          <Typography.Body1>
            {t('multi send')} {tokenSent}
          </Typography.Body1>
          <Typography.Caption>{t('to')}</Typography.Caption>
          {outputAddresses.map((address, index) => (
            <Typography.Caption key={`w${index * 2}`} numberOfLines={1} ellipsizeMode="middle">
              {address}
            </Typography.Caption>
          ))}
        </View>
      )}
    />
  );
};
