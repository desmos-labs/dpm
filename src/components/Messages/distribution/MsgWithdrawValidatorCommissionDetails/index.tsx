import React from 'react';
import { Trans } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import Typography from 'components/Typography';
import CopiableAddress from 'components/CopiableAddress';
import { MsgWithdrawValidatorCommissionEncodeObject } from 'types/cosmos';

/**
 * Displays the full details of a MsgWithdrawDelegatorRewards.
 * @constructor
 */
const MsgWithdrawDelegatorRewardsDetails: MessageDetailsComponent<
  MsgWithdrawValidatorCommissionEncodeObject
> = ({ message, toBroadcastMessage }) => (
  <BaseMessageDetails message={message}>
    <Typography.Regular14>
      <Trans
        ns="messages.distribution"
        i18nKey={
          toBroadcastMessage ? 'withdraw commission description' : 'withdrew commission description'
        }
        components={[<CopiableAddress address={message.value.validatorAddress} />]}
      />
    </Typography.Regular14>
  </BaseMessageDetails>
);

export default MsgWithdrawDelegatorRewardsDetails;
