import { MsgWithdrawDelegatorRewardEncodeObject } from '@cosmjs/stargate';
import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';

/**
 * Displays the full details of a MsgWithdrawDelegatorRewards.
 * @constructor
 */
const MsgWithdrawDelegatorRewardsDetails: MessageDetailsComponent<
  MsgWithdrawDelegatorRewardEncodeObject
> = ({ message }) => {
  const { t } = useTranslation('messages.distribution');
  const { value } = message;

  return (
    <BaseMessageDetails
      message={message}
      fields={[
        {
          label: t('transaction:from'),
          value: value.validatorAddress,
        },
      ]}
    />
  );
};

export default MsgWithdrawDelegatorRewardsDetails;
