import { EncodeObject } from '@cosmjs/proto-signing';
import React from 'react';
import { messageDetailsComponents } from 'components/Messages/components';
import MsgUnknownComponents from './MsgUnknown';

export type MessageListItemProps = {
  /**
   * Message to be displayed.
   */
  message: EncodeObject;

  /**
   * Date of the transaction associated with the message.
   */
  date: Date;
};

const MessageListItem = (props: MessageListItemProps) => {
  const { message, date } = props;
  const messageComponents = messageDetailsComponents[message.typeUrl] || MsgUnknownComponents;
  const ListItemComponent = messageComponents.listItem;
  return <ListItemComponent message={message} date={date} />;
};

export default MessageListItem;
