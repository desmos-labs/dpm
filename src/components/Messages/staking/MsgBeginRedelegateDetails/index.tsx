import { MsgBeginRedelegateEncodeObject } from '@cosmjs/stargate';
import React, { useMemo } from 'react';
import { Trans } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import { formatCoin } from 'lib/FormatUtils';
import Typography from 'components/Typography';
import CopiableAddress from 'components/CopiableAddress';

/**
 * Displays the full details of a MsgBeginRedelegate.
 * @constructor
 */
const MsgBeginRedelegateDetails: MessageDetailsComponent<MsgBeginRedelegateEncodeObject> = ({
  message,
  toBroadcastMessage,
}) => {
  const amount = useMemo(
    () => (message.value.amount ? formatCoin(message.value.amount) : ''),
    [message.value.amount],
  );

  return (
    <BaseMessageDetails message={message}>
      <Typography.Regular14>
        <Trans
          ns="messages.staking"
          i18nKey={toBroadcastMessage ? 'redelegate description' : 'redelegated description'}
          components={[
            <CopiableAddress address={message.value.delegatorAddress} />,
            <Typography.SemiBold14 />,
            <CopiableAddress address={message.value.validatorSrcAddress} />,
            <CopiableAddress address={message.value.validatorDstAddress} />,
          ]}
          values={{
            amount,
          }}
        />
      </Typography.Regular14>
    </BaseMessageDetails>
  );
};

export default MsgBeginRedelegateDetails;
