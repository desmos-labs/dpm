import { EncodeObject } from '@cosmjs/proto-signing';
import React from 'react';
import { messageDetailsComponents } from './components';
import MsgUnknownComponents from './MsgUnknown';

export type MessageDetailsProps = {
  /**
   * The message to display.
   */
  message: EncodeObject;
};

const MessageDetails = (props: MessageDetailsProps) => {
  const { message } = props;
  const messageComponents = messageDetailsComponents[message.typeUrl] || MsgUnknownComponents;
  const DetailsComponent = messageComponents.details;
  return <DetailsComponent message={message} />;
};

export default MessageDetails;
