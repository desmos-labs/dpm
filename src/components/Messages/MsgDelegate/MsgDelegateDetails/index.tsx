import { convertCoin } from '@desmoslabs/desmjs';
import { MsgDelegateEncodeObject } from '@cosmjs/stargate';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useCurrentChainInfo } from '@recoil/settings';
import { msgDelegateIcon } from 'assets/images';
import BaseMessageDetails from '../../BaseMessage/BaseMessageDetails';

export type MsgDelegateDetailsProps = {
  message: MsgDelegateEncodeObject['value'];
};

/**
 * Displays the full details of a MsgDelegate
 * @constructor
 */
const MsgDelegateDetails = (props: MsgDelegateDetailsProps) => {
  const { t } = useTranslation();
  const chainInfo = useCurrentChainInfo();

  const { message } = props;
  const amount = useMemo(() => {
    const totalAmount = message?.amount;
    if (totalAmount !== undefined) {
      const converted = convertCoin(totalAmount, 6, chainInfo.currencies);
      if (converted !== null) {
        return `${converted.amount} ${converted.denom.toUpperCase()}`;
      }
      return '';
    }
    return '';
  }, [message?.amount, chainInfo.currencies]);

  return (
    <BaseMessageDetails
      icon={msgDelegateIcon}
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

export default MsgDelegateDetails;
