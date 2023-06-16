import { MsgSendEncodeObject } from '@cosmjs/stargate';
import React, { useMemo } from 'react';
import { Trans } from 'react-i18next';
import { formatCoins } from 'lib/FormatUtils';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import Typography from 'components/Typography';
import CopiableAddress from 'components/CopiableAddress';

/**
 * Displays the full details of a MsgSend.
 */
const MsgSendDetails: MessageDetailsComponent<MsgSendEncodeObject> = ({ message }) => {
  const { value } = message;
  const convertedAmount = useMemo(() => formatCoins(value.amount), [value.amount]);

  return (
    <BaseMessageDetails message={message}>
      <Typography.Regular14>
        <Trans
          ns={'messages.bank'}
          i18nKey={'send description'}
          components={[
            <CopiableAddress address={message.value.fromAddress ?? ''} />,
            <Typography.SemiBold14 />,
            <CopiableAddress address={message.value.toAddress ?? ''} />,
          ]}
          values={{ amount: convertedAmount }}
        />
      </Typography.Regular14>
    </BaseMessageDetails>
  );
};

export default MsgSendDetails;
