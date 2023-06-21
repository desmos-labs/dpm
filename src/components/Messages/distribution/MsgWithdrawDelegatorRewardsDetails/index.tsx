import { MsgWithdrawDelegatorRewardEncodeObject } from '@cosmjs/stargate';
import React from 'react';
import { Trans } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import Typography from 'components/Typography';
import CopiableAddress from 'components/CopiableAddress';

/**
 * Displays the full details of a MsgWithdrawDelegatorRewards.
 * @constructor
 */
const MsgWithdrawDelegatorRewardsDetails: MessageDetailsComponent<
  MsgWithdrawDelegatorRewardEncodeObject
> = ({ message, toBroadcastMessage }) => (
  <BaseMessageDetails message={message}>
    <Typography.Regular14>
      <Trans
        ns="messages.distribution"
        i18nKey={
          toBroadcastMessage ? 'withdraw rewards description' : 'withdrew rewards description'
        }
        components={[
          <CopiableAddress address={message.value.delegatorAddress ?? ''} />,
          <CopiableAddress address={message.value.validatorAddress ?? ''} />,
        ]}
      />
    </Typography.Regular14>
  </BaseMessageDetails>
);

export default MsgWithdrawDelegatorRewardsDetails;
