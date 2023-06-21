import React from 'react';
import { Trans } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import Typography from 'components/Typography';
import CopiableAddress from 'components/CopiableAddress';
import { MsgCreateValidatorEncodeObject } from '@cosmjs/stargate';

/**
 * Displays the full details of a MsgCreateValidator
 * @constructor
 */
const MsgCreateValidatorDetails: MessageDetailsComponent<MsgCreateValidatorEncodeObject> = ({
  message,
  toBroadcastMessage,
}) => (
  <BaseMessageDetails message={message}>
    <Typography.Regular14>
      <Trans
        ns="messages.staking"
        i18nKey={
          toBroadcastMessage ? 'create validator description' : 'created validator description'
        }
        components={[
          <CopiableAddress address={message.value.delegatorAddress} />,
          <CopiableAddress address={message.value.validatorAddress} />,
        ]}
      />
    </Typography.Regular14>
  </BaseMessageDetails>
);

export default MsgCreateValidatorDetails;
