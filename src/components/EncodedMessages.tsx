import React from 'react';
import { EncodeObject } from '@cosmjs/proto-signing';
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

export const EncodedMessages: React.FC<Props> = (props) => (
  <ScrollView style={props.style} nestedScrollEnabled={props.nestedScrollEnabled}>
    <Text>{JSON.stringify(props.encodeMessages, null, 2)}</Text>
  </ScrollView>
);
