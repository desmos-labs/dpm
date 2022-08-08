import { convertCoin } from '@desmoslabs/desmjs';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import useCurrentChainInfo from '../../../../hooks/desmosclient/useCurrentChainInfo';
import { MsgMultiSendEncodeObject } from '../../../../types/encodeobject';
import { BaseMessageDetails } from '../BaseMessageDetails';

export type Props = {
  message: MsgMultiSendEncodeObject["value"];
};

/**
 * Displays the full details of a MsgMultiSend
 * @constructor
 */
export const MessageMultiSendDetails: React.FC<Props> = ({ message}) => {
  const { t } = useTranslation();
  const chainInfo = useCurrentChainInfo();

  const amounts = useMemo(() => {
    const inputs = message?.inputs ?? [];
    return inputs
      .map((input) => {
        const serializedCoins = input.coins
          .map((c) => convertCoin(c, 6, chainInfo.denomUnits))
          .filter((c) => c !== null)
          .map((c) => `${c!.amount} ${c!.denom.toUpperCase()}`)
          .join('\n');
        return `${serializedCoins}`;
      })
      .join(', ');
  }, [chainInfo.denomUnits, message?.inputs]);

  const outputs = useMemo(() => {
    const multiOutputs = message?.outputs ?? [];

    return multiOutputs
      .map((output) => {
        const serializedCoins = output.coins
          .map((c) => convertCoin(c, 6, chainInfo.denomUnits))
          .filter((c) => c !== null)
          .map((c) => `${c!.amount} ${c!.denom.toUpperCase()}`)
          .join('\n');
        return {
          amount: serializedCoins,
          to: output.address,
        };
      })
      .map((serializedOutput) => [
        {
          label: t('to'),
          value: serializedOutput.to,
        },
        {
          label: t('amount'),
          value: serializedOutput.amount,
        },
      ])
      .reduce((oldValue, sum) => [...oldValue, ...sum], []);
  }, [
    chainInfo.denomUnits,
    message?.outputs,
    t,
  ]);

  return (
    <BaseMessageDetails
      icon={require('../../../../assets/tx-icons/send.png')}
      iconSubtitle={amounts}
      fields={[...outputs]}
    />
  );
};
