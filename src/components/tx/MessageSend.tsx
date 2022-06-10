import { convertCoin } from '@desmoslabs/desmjs';
import { AminoMsgSend, MsgSendEncodeObject } from '@cosmjs/stargate';
import { MsgSend } from 'cosmjs-types/cosmos/bank/v1beta1/tx';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import useCurrentChainInfo from '../../hooks/desmosclient/useCurrentChainInfo';
import { SimpleMessageComponent } from './SimpleMessageComponent';

export type Props = {
  protobufMessage?: MsgSend;
  encodeObject?: MsgSendEncodeObject['value'];
  aminoMessage?: AminoMsgSend['value'];
};

export const MessageSend: React.FC<Props> = ({ protobufMessage, encodeObject, aminoMessage }) => {
  const { t } = useTranslation();
  const chainInfo = useCurrentChainInfo();

  const convertedAmount = useMemo(() => {
    const amount = protobufMessage?.amount ?? encodeObject?.amount ?? aminoMessage?.amount;

    return amount
      ? amount
          .map((coinAmount) => {
            const converted = convertCoin(coinAmount, 6, chainInfo.denomUnits);
            if (converted !== null) {
              return `${converted.amount} ${converted.denom.toUpperCase()}`;
            }
            return `${coinAmount.amount} ${coinAmount.denom}`;
          })
          .join('\n')
      : '';
  }, [protobufMessage?.amount, encodeObject?.amount, chainInfo.denomUnits, aminoMessage?.amount]);

  return (
    <SimpleMessageComponent
      icon={require('../../assets/tx-icons/send.png')}
      iconSubtitle={convertedAmount}
      fields={[
        {
          label: t('from'),
          value:
            protobufMessage?.fromAddress ??
            encodeObject?.fromAddress ??
            aminoMessage?.from_address ??
            '',
        },
        {
          label: t('to'),
          value:
            protobufMessage?.toAddress ?? encodeObject?.toAddress ?? aminoMessage?.to_address ?? '',
        },
        {
          label: t('amount'),
          value: convertedAmount,
        },
      ]}
    />
  );
};
