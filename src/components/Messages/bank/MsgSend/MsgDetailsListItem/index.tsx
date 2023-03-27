import { MsgSendEncodeObject } from '@cosmjs/stargate';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { formatCoins } from 'lib/FormatUtils';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { msgSendIcon } from 'assets/images';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';

/**
 * Displays the full details of a MsgSend.
 */
const MsgSendDetails: MessageDetailsComponent<MsgSendEncodeObject> = ({ message }) => {
  const { t } = useTranslation('messages.bank');
  const { value } = message;
  const convertedAmount = useMemo(() => formatCoins(value.amount), [value.amount]);

  return (
    <BaseMessageDetails
      icon={msgSendIcon}
      iconSubtitle={convertedAmount}
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
    />
  );
};

export default MsgSendDetails;
