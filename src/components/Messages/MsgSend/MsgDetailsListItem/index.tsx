import { MsgSendEncodeObject } from '@cosmjs/stargate';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { formatCoins } from 'lib/FormatUtils';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { msgSendIcon } from 'assets/images';

export type MsgSendDetailsProps = {
  message: MsgSendEncodeObject;
};

/**
 * Displays the full details of a MsgSend.
 */
const MsgSendDetails = (props: MsgSendDetailsProps) => {
  const { t } = useTranslation('sendTokens');
  const { message } = props;
  const { value } = message;
  const convertedAmount = useMemo(() => formatCoins(value.amount), [value.amount]);

  return (
    <BaseMessageDetails
      icon={msgSendIcon}
      iconSubtitle={convertedAmount}
      fields={[
        {
          label: t('from'),
          value: value.fromAddress ?? '',
        },
        {
          label: t('to'),
          value: value.toAddress ?? '',
        },
        {
          label: t('amount'),
          value: convertedAmount,
        },
      ]}
    />
  );
};

export default MsgSendDetails;
