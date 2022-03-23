import React, { useState } from 'react';
import {
  Button,
  NativeSyntheticEvent,
  NativeTouchEvent,
  Text,
  TextInput,
  View,
} from 'react-native';

type Props = {
  onPairRequest?: (uri: string) => void;
};

export default function WalletConnectUriPair(props: Props): JSX.Element {
  const [uri, setUri] = useState('');

  const onTextChange = (text: string) => {
    setUri(text);
  };

  const onConnectPressed = (_: NativeSyntheticEvent<NativeTouchEvent>) => {
    if (props.onPairRequest !== undefined) {
      props.onPairRequest(uri);
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
