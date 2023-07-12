import { MsgDepositEncodeObject } from '@cosmjs/stargate';
import React from 'react';
import { Trans } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import { formatCoins } from 'lib/FormatUtils';
import CopiableAddress from 'components/CopiableAddress';
import Typography from 'components/Typography';
import { Gov } from '@desmoslabs/desmjs';

/**
 * Displays the full details of a MsgDeposit.
 */
const MsgDepositDetails: MessageDetailsComponent<
  MsgDepositEncodeObject | Gov.v1.MsgDepositEncodeObject
> = ({ message, toBroadcastMessage }) => {
  const depositAmount = React.useMemo(
    () => formatCoins(message.value.amount),
    [message.value.amount],
  );

  return (
    <BaseMessageDetails message={message}>
      <Typography.Regular14>
        <Trans
          ns="messages.gov"
          i18nKey={toBroadcastMessage ? 'deposit description' : 'deposited description'}
          components={[
            <CopiableAddress address={message.value.depositor} />,
            <Typography.SemiBold14 />,
            <Typography.SemiBold14 />,
          ]}
          values={{ depositAmount, proposalId: message.value.proposalId?.toString() ?? '' }}
        />
      </Typography.Regular14>
    </BaseMessageDetails>
  );
};

export default MsgDepositDetails;
