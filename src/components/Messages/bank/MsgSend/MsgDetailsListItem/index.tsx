import { MsgSendEncodeObject } from '@cosmjs/stargate';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { formatCoins } from 'lib/FormatUtils';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import Typography from 'components/Typography';

/**
 * Displays the full details of a MsgSend.
 */
const MsgSendDetails: MessageDetailsComponent<MsgSendEncodeObject> = ({ message }) => {
  const { t } = useTranslation('messages.bank');
  const { value } = message;
  const convertedAmount = useMemo(() => formatCoins(value.amount), [value.amount]);

  return (
    <BaseMessageDetails
      message={message}
      fields={[
        {
          label: t('transaction:from'),
          value: value.fromAddress ?? '',
        },
        {
          label: t('transaction:to'),
          value: value.toAddress ?? '',
        },
        {
          label: t('sendTokens:amount'),
          value: convertedAmount,
        },
      ]}
    >
      <Typography.Regular14>
        {value.fromAddress} sent {convertedAmount} to {value.toAddress}
      </Typography.Regular14>
    </BaseMessageDetails>
  );
};

export default MsgSendDetails;
