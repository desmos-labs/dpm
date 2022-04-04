import { AminoMsgDelegate, convertCoin, MsgDelegateEncodeObject } from '@desmoslabs/sdk-core';
import { useCurrentChainInfo } from '@desmoslabs/sdk-react';
import { MsgDelegate } from 'cosmjs-types/cosmos/staking/v1beta1/tx';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SimpleMessageComponent } from './SimpleMessageComponent';

export type Props = {
  protobufMessage?: MsgDelegate;
  encodeObject?: MsgDelegateEncodeObject['value'];
  aminoMessage?: AminoMsgDelegate['value'];
};

export const MessageDelegate: React.FC<Props> = ({
  protobufMessage,
  encodeObject,
  aminoMessage,
}) => {
  const { t } = useTranslation();
  const chainInfo = useCurrentChainInfo();

  const amount = useMemo(() => {
    const totalAmount = protobufMessage?.amount ?? encodeObject?.amount ?? aminoMessage?.amount;
    if (totalAmount !== undefined) {
      const converted = convertCoin(totalAmount, 6, chainInfo.denomUnits);
      if (converted !== null) {
        return `${converted.amount} ${converted.denom.toUpperCase()}`;
      }
      return '';
    }
    return '';
  }, [protobufMessage?.amount, encodeObject?.amount, chainInfo.denomUnits, aminoMessage?.amount]);

  return (
    <SimpleMessageComponent
      icon={require('../../assets/tx-icons/delegate.png')}
      iconSubtitle={`${t('delegate')} ${amount}`}
      fields={[
        {
          label: t('amount'),
          value: amount,
        },
        {
          label: t('from'),
          value:
            protobufMessage?.delegatorAddress ??
            encodeObject?.delegatorAddress ??
            aminoMessage?.delegator_address ??
            '',
        },
        {
          label: t('to'),
          value:
            protobufMessage?.validatorAddress ??
            encodeObject?.validatorAddress ??
            aminoMessage?.validator_address ??
            '',
        },
      ]}
    />
  );
};
