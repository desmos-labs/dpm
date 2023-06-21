import React from 'react';
import { Trans } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import Typography from 'components/Typography';
import { MsgFundCommunityPoolEncodeObject } from 'types/cosmos';
import { formatCoins } from 'lib/FormatUtils';
import CopiableAddress from 'components/CopiableAddress';

/**
 * Displays the full details of a MsgWithdrawDelegatorRewards.
 * @constructor
 */
const MsgWithdrawDelegatorRewardsDetails: MessageDetailsComponent<
  MsgFundCommunityPoolEncodeObject
> = ({ message, toBroadcastMessage }) => {
  const amount = React.useMemo(() => formatCoins(message.value.amount), [message.value.amount]);

  return (
    <BaseMessageDetails message={message}>
      <Typography.Regular14>
        <Trans
          ns="messages.distribution"
          i18nKey={
            toBroadcastMessage
              ? 'send to community pool description'
              : 'sent to community pool description'
          }
          components={[
            <CopiableAddress address={message.value.depositor} />,
            <Typography.SemiBold14 />,
          ]}
          values={{ amount }}
        />
      </Typography.Regular14>
    </BaseMessageDetails>
  );
};

export default MsgWithdrawDelegatorRewardsDetails;
