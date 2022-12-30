import React, { useState } from 'react';
import {
  Button,
  NativeSyntheticEvent,
  NativeTouchEvent,
  Text,
  TextInput,
  View,
} from 'react-native';

export type WalletConnectUriPairProps = {
  onPairRequest?: (uri: string) => void;
};

export function WalletConnectUriPair(props: WalletConnectUriPairProps): JSX.Element {
  const { onPairRequest } = props;
  const [uri, setUri] = useState('');

  const onTextChange = (text: string) => {
    setUri(text);
  };

  const onConnectPressed = (_: NativeSyntheticEvent<NativeTouchEvent>) => {
    if (onPairRequest !== undefined) {
      onPairRequest(uri);
    }
  };

  return (
    <View>
      <Text>Uri</Text>
      <TextInput onChangeText={onTextChange} value={uri} accessibilityLabel="uri" />
      <Button title="Connect" onPress={onConnectPressed} />
    </View>
  );
}

export default WalletConnectUriPair;