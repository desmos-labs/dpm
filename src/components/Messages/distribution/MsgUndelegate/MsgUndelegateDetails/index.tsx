import { MsgUndelegateEncodeObject } from '@cosmjs/stargate';
import React from 'react';
import { useTranslation } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { msgWithdrawIcon } from 'assets/images';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import { formatCoin } from 'lib/FormatUtils';

/**
 * Displays the full details of a MsgUndelegate.
 * @constructor
 */
const MsgUndelegateDetails: MessageDetailsComponent<MsgUndelegateEncodeObject> = ({ message }) => {
  const { t } = useTranslation('messages.staking');
  const { value } = message;

  return (
    <BaseMessageDetails
      icon={msgWithdrawIcon}
      iconSubtitle={t('undelegate')}
      fields={[
        {
          label: t('transaction:from'),
          value: value.validatorAddress,
        },
        {
          label: t('amount'),
          value: value.amount ? formatCoin(value.amount) : '',
        },
      ]}
    />
  );
};

export default MsgUndelegateDetails;
