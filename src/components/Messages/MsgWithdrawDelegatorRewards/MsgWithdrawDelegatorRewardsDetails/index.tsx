import { MsgWithdrawDelegatorRewardEncodeObject } from '@cosmjs/stargate';
import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { msgWithdrawIcon } from 'assets/images';

export type MsgWithdrawDelegatorRewardsDetailsProps = {
  message: MsgWithdrawDelegatorRewardEncodeObject['value'];
};

/**
 * Displays the full details of a MsgWithdrawDelegatorRewards.
 * @constructor
 */
const MsgWithdrawDelegatorRewardsDetails = (props: MsgWithdrawDelegatorRewardsDetailsProps) => {
  const { t } = useTranslation();
  const { message } = props;

  return (
    <BaseMessageDetails
      icon={msgWithdrawIcon}
      iconSubtitle={t('withdraw rewards')}
      fields={[
        {
          label: t('from'),
          value: message.validatorAddress,
        },
      ]}
    />
  );
};

export default MsgWithdrawDelegatorRewardsDetails;
