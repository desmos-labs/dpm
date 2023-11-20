import { EncodeObject } from '@cosmjs/proto-signing';
import React from 'react';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import Typography from 'components/Typography';

/**
 * Displays the full details of an MsgUnknown message.
 * @constructor
 */
const MsgUnknownDetails: MessageDetailsComponent<EncodeObject> = ({ message }) => (
  <BaseMessageDetails message={message}>
    <Typography.Regular14>{JSON.stringify(message.value)}</Typography.Regular14>
  </BaseMessageDetails>
);

export default MsgUnknownDetails;
