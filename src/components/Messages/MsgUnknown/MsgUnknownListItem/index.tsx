import React from 'react';
import { msgUnknownIcon } from 'assets/images';
import { View } from 'react-native';
import Typography from 'components/Typography';
import { EncodeObject } from '@cosmjs/proto-signing';
import BaseMessageListItem from 'components/Messages/BaseMessage/BaseMessageListItem';
import { MessageListItemComponent } from 'components/Messages/BaseMessage';

export const MsgUnknownListItem: MessageListItemComponent<EncodeObject> = ({ message, date }) => {
  const msgPosition = message.typeUrl.indexOf('.Msg');
  const typeUrl = message.typeUrl.slice(msgPosition + 1);
  return (
    <BaseMessageListItem
      icon={msgUnknownIcon}
      date={date}
      renderContent={() => (
        <View>
          <Typography.Body>{typeUrl}</Typography.Body>
        </View>
      )}
    />
  );
};

export default MsgUnknownListItem;
