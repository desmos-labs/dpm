import {ChainInfo, convertCoin} from '@desmoslabs/desmjs';
import React, {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {Input} from 'cosmjs-types/cosmos/bank/v1beta1/bank';
import useCurrentChainInfo from 'hooks/desmosclient/useCurrentChainInfo';
import {MsgMultiSendEncodeObject} from 'types/encodeobject';
import BaseMessage from '../BaseMessage';
import Typography from '../../Typography';

export type DetailsProps = {
  message: MsgMultiSendEncodeObject['value'];
};

export type ListItemProps = {
  message: MsgMultiSendEncodeObject['value'];
  date: Date;
};

function serializeInputs(inputs: Input[], chainInfo: ChainInfo, separator: string) {
  return inputs
    .map((input) => input.coins
      .map((c) => convertCoin(c, 6, chainInfo.currencies))
      .filter((c) => c !== null)
      .map((c) => `${c?.amount} ${c?.denom?.toUpperCase()}`)
      .join(separator))
    .join(', ');
}

namespace MsgMultiSend {
  /**
   * Displays the short details of a MsgMultiSend within a list.
   * @constructor
   */
  export const ListItem: React.FC<ListItemProps> = ({message, date}) => {
    const {t} = useTranslation();
    const chainInfo = useCurrentChainInfo();

    const tokenSent = useMemo(
      () => serializeInputs(message.inputs, chainInfo, ', '),
      [message.inputs, chainInfo],
    );

    const outputAddresses = useMemo(
      () => message.outputs.map((output) => output.address),
      [message.outputs],
    );

    return (
      <BaseMessage.ListItem
        icon={require('assets/tx-icons/send.png')}
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

  /**
   * Displays the full details of a MsgMultiSend
   * @constructor
   */
  export const Details: React.FC<DetailsProps> = ({message}) => {
    const {t} = useTranslation();
    const chainInfo = useCurrentChainInfo();

    const amounts = useMemo(
      () => serializeInputs(message.inputs, chainInfo, '\n'),
      [message.inputs, chainInfo],
    );

    const outputs = useMemo(() => {
      const multiOutputs = message?.outputs ?? [];

      return multiOutputs
        .map((output) => {
          const serializedCoins = output.coins
            .map((c) => convertCoin(c, 6, chainInfo.currencies))
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
      chainInfo.currencies,
      message?.outputs,
      t,
    ]);

    return (
      <BaseMessage.Details
        icon={require('assets/tx-icons/send.png')}
        iconSubtitle={amounts}
        fields={[...outputs]}
      />
    );
  };
}

export default MsgMultiSend;
