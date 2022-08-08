import { convertCoin } from '@desmoslabs/desmjs';
import { MsgDelegateEncodeObject } from '@cosmjs/stargate';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import useCurrentChainInfo from '../../../../hooks/desmosclient/useCurrentChainInfo';
import { BaseMessageDetails } from '../BaseMessageDetails';

export type Props = {
  message: MsgDelegateEncodeObject["value"];
};

/**
 * Displays the full details of a MsgDelegate
 * @constructor
 */
export const MessageDelegateDetails: React.FC<Props> = ({message}) => {
  const { t } = useTranslation();
  const chainInfo = useCurrentChainInfo();

  const amount = useMemo(() => {
    const totalAmount = message?.amount;
    if (totalAmount !== undefined) {
      const converted = convertCoin(totalAmount, 6, chainInfo.denomUnits);
      if (converted !== null) {
        return `${converted.amount} ${converted.denom.toUpperCase()}`;
      }
      return '';
    }
    return '';
  }, [message?.amount, chainInfo.denomUnits]);

  return (
    <BaseMessageDetails
      icon={require('../../../../assets/tx-icons/delegate.png')}
      iconSubtitle={`${t('delegate')} ${amount}`}
      fields={[
        {
          label: t('amount'),
          value: amount,
        },
        {
          label: t('from'),
          value: message?.delegatorAddress ?? '',
        },
        {
          label: t('to'),
          value: message?.validatorAddress ?? '',
        },
      ]}
    />
  );
};
