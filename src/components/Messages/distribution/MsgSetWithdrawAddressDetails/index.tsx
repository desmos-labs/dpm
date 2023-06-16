import React from 'react';
import { Trans } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import Typography from 'components/Typography';
import CopiableAddress from 'components/CopiableAddress';
import { MsgSetWithdrawAddressEncodeObject } from 'types/cosmos';

/**
 * Displays the full details of a MsgWithdrawDelegatorRewards.
 * @constructor
 */
const MsgWithdrawDelegatorRewardsDetails: MessageDetailsComponent<
  MsgSetWithdrawAddressEncodeObject
> = ({ message }) => (
  <BaseMessageDetails message={message}>
    <Typography.Regular14>
      <Trans
        ns="messages.distribution"
        i18nKey="set rewards address description"
        components={[
          <CopiableAddress address={message.value.delegatorAddress} />,
          <CopiableAddress address={message.value.withdrawAddress} />,
        ]}
      />
    </Typography.Regular14>
  </BaseMessageDetails>
);

export default MsgWithdrawDelegatorRewardsDetails;
