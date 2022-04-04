import { EncodeObject } from '@cosmjs/proto-signing';
import React from 'react';
import { View } from 'react-native';
import { Typography } from '../../typography';
import { BaseMessageListItem } from './BaseMessageListItem';

export type Props = {
  encodeObject: EncodeObject;
  date: Date;
};

export const UnknownMessageListItem: React.FC<Props> = (props) => {
  const { encodeObject, date } = props;

  return (
    <BaseMessageListItem
      icon={require('../../../assets/tx-icons/general-1.png')}
      date={date}
      renderContent={() => (
        <View>
          <Typography.Caption>{encodeObject.typeUrl}</Typography.Caption>
        </View>
      )}
    />
  );
};
