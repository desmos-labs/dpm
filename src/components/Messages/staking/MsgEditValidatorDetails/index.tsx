import React from 'react';
import { Trans } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import Typography from 'components/Typography';
import CopiableAddress from 'components/CopiableAddress';
import { MsgEditValidatorEncodeObject } from '@cosmjs/stargate';

/**
 * Displays the full details of a MsgEditValidator
 * @constructor
 */
const MsgEditValidatorDetails: MessageDetailsComponent<MsgEditValidatorEncodeObject> = ({
  message,
}) => (
  <BaseMessageDetails message={message}>
    <Typography.Regular14>
      <Trans
        ns="messages.staking"
        i18nKey="edit validator description"
        components={[<CopiableAddress address={message.value.validatorAddress} />]}
      />
    </Typography.Regular14>
  </BaseMessageDetails>
);

export default MsgEditValidatorDetails;
