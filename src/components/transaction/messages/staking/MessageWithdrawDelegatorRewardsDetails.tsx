import {
  MsgWithdrawDelegatorRewardEncodeObject,
} from '@cosmjs/stargate';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { BaseMessageDetails } from '../BaseMessageDetails';

export type Props = {
  message?: MsgWithdrawDelegatorRewardEncodeObject['value'];
};

/**
 * Displays the full details of a MsgWithdrawDelegatorRewards.
 * @constructor
 */
export const MessageWithdrawDelegatorRewardsDetails: React.FC<Props> = ({message}) => {
  const { t } = useTranslation();

  return (
    <BaseMessageDetails
      icon={require('../../../../assets/tx-icons/withdraw.png')}
      iconSubtitle={t('withdraw rewards')}
      fields={[
        {
          label: t('from'),
          value: message?.validatorAddress
        },
      ]}
    />
  );
};
