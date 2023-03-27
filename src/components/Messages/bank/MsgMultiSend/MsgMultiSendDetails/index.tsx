import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { msgSendIcon } from 'assets/images';
import { formatCoins, formatMultiSendInput } from 'lib/FormatUtils';
import { MsgMultiSendEncodeObject } from '@desmoslabs/desmjs';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';

/**
 * Displays the full details of a MsgMultiSend
 * @constructor
 */
const MsgMultiSendDetails: MessageDetailsComponent<MsgMultiSendEncodeObject> = ({ message }) => {
  const { t } = useTranslation('messages.bank');
  const { value } = message;
  const amounts = useMemo(() => formatMultiSendInput(value.inputs), [value.inputs]);

  const outputs = useMemo(() => {
    const multiOutputs = value.outputs ?? [];
    return multiOutputs
      .map((output) => {
        const serializedCoins = formatCoins(output.coins);
        return {
          amount: serializedCoins,
          to: output.address,
        };
      })
      .map((serializedOutput) => [
        {
          label: t('transaction:to'),
          value: serializedOutput.to,
        },
        {
          label: t('sendTokens:amount'),
          value: serializedOutput.amount,
        },
      ])
      .reduce((oldValue, sum) => [...oldValue, ...sum], []);
  }, [value.outputs, t]);

  return <BaseMessageDetails icon={msgSendIcon} iconSubtitle={amounts} fields={[...outputs]} />;
};

export default MsgMultiSendDetails;