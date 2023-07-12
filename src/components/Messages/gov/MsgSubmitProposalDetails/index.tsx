import { MsgSubmitProposalEncodeObject } from '@cosmjs/stargate';
import React from 'react';
import { Trans } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import { formatCoins } from 'lib/FormatUtils';
import CopiableAddress from 'components/CopiableAddress';
import Typography from 'components/Typography';
import { Gov } from '@desmoslabs/desmjs';

/**
 * Displays the full details of a MsgSubmitProposal.
 */
const MsgSubmitProposalDetails: MessageDetailsComponent<
  MsgSubmitProposalEncodeObject | Gov.v1.MsgSubmitProposalEncodeObject
> = ({ message, toBroadcastMessage }) => {
  const initialDeposit = React.useMemo(
    () => formatCoins(message.value.initialDeposit),
    [message.value.initialDeposit],
  );

  return (
    <BaseMessageDetails message={message}>
      <Typography.Regular14>
        <Trans
          ns="messages.gov"
          i18nKey={
            toBroadcastMessage ? 'submit proposal description' : 'submitted proposal description'
          }
          components={[
            <CopiableAddress address={message.value.proposer} />,
            <Typography.SemiBold14 />,
          ]}
          values={{ initialDeposit }}
        />
      </Typography.Regular14>
    </BaseMessageDetails>
  );
};

export default MsgSubmitProposalDetails;
