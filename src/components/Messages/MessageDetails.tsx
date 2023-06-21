import { EncodeObject } from '@cosmjs/proto-signing';
import React from 'react';
import { messageDetailsComponents } from './components';
import MsgUnknownComponents from './MsgUnknown';

export type MessageDetailsProps = {
  /**
   * The message to display.
   */
  readonly message: EncodeObject;
  /**
   * If `true` tells that the messages is a message that is going to be
   * broadcasted from the user, otherwise means that the message
   * is a previously broadcasted user's message.
   */
  readonly toBroadcastMessage: boolean;
};

const MessageDetails: React.FC<MessageDetailsProps> = ({ message, toBroadcastMessage }) =>
  React.useMemo(() => {
    const DetailsComponent = messageDetailsComponents[message.typeUrl] || MsgUnknownComponents;
    return <DetailsComponent message={message} toBroadcastMessage={toBroadcastMessage} />;
  }, [message, toBroadcastMessage]);

export default MessageDetails;
