import { EncodeObject } from '@cosmjs/proto-signing';
import React from 'react';
import { View } from 'react-native';
import { Typography } from '../../../typography';
import { BaseMessageListItem } from '../BaseMessageListItem';

export type Props = {
  message: EncodeObject;
  date: Date;
};

export const MessageUnknownListItem: React.FC<Props> = ({ message, date }) => (
    <BaseMessageListItem
      icon={require('../../../../assets/tx-icons/general-1.png')}
      date={date}
      renderContent={() => (
        <View>
          <Typography.Caption>{message.typeUrl}</Typography.Caption>
        </View>
      )}
    />
  );
