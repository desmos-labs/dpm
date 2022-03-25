import { EncodeObject } from '@cosmjs/proto-signing';
import React from 'react';
import { ScrollView, StyleProp, Text, ViewStyle } from 'react-native';

export type Props = {
  /**
   * The messages to display.
   */
  encodeMessages: EncodeObject[];
  /**
   * Enables nested scrolling for Android API level 21+.
   * Nested scrolling is supported by default on iOS.
   */
  nestedScrollEnabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export const EncodedMessages: React.FC<Props> = (props) => {
  const { encodeMessages, nestedScrollEnabled, style } = props;
  return (
    <ScrollView style={style} nestedScrollEnabled={nestedScrollEnabled}>
      <Text>{JSON.stringify(encodeMessages, null, 2)}</Text>
    </ScrollView>
  );
};
