import { TokenFactory } from '@desmoslabs/desmjs';
import React from 'react';
import { Trans } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import Typography from 'components/Typography';
import CopiableAddress from 'components/CopiableAddress';

/**
 * Displays the full details of a MsgCreateDenom
 * @constructor
 */
const MsgCreateDenomDetails: MessageDetailsComponent<
  TokenFactory.v1.MsgCreateDenomEncodeObject
> = ({ message, toBroadcastMessage }) => (
  <BaseMessageDetails message={message}>
    <Typography.Regular14>
      <Trans
        ns="messages.tokenfactory"
        i18nKey={toBroadcastMessage ? 'create denom description' : 'user created denom description'}
        components={[
          <CopiableAddress address={message.value.sender} />,
          <Typography.SemiBold14 />,
          <Typography.SemiBold14 />,
        ]}
        values={{
          subspaceId: message.value.subspaceId,
          denom: message.value.subdenom,
        }}
      />
    </Typography.Regular14>
  </BaseMessageDetails>
);

export default MsgCreateDenomDetails;
