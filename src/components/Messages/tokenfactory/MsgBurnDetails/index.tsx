import { TokenFactory } from '@desmoslabs/desmjs';
import React from 'react';
import { Trans } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import Typography from 'components/Typography';
import CopiableAddress from 'components/CopiableAddress';
import { formatCoin } from 'lib/FormatUtils';

/**
 * Displays the full details of a MsgBurn
 * @constructor
 */
const MsgBurnDetails: MessageDetailsComponent<TokenFactory.v1.MsgBurnEncodeObject> = ({
  message,
  toBroadcastMessage,
}) => (
  <BaseMessageDetails message={message}>
    <Typography.Regular14>
      <Trans
        ns="messages.tokenfactory"
        i18nKey={toBroadcastMessage ? 'burn coins description' : 'user burned coins description'}
        components={[
          <CopiableAddress address={message.value.sender} />,
          <Typography.SemiBold14 />,
          <Typography.SemiBold14 />,
        ]}
        values={{
          subspaceId: message.value.subspaceId,
          amount: message.value.amount ? formatCoin(message.value.amount) : '',
        }}
      />
    </Typography.Regular14>
  </BaseMessageDetails>
);

export default MsgBurnDetails;
