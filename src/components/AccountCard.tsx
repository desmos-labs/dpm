import React from 'react';
import { Text, TouchableHighlight, View } from 'react-native';
import { ChainAccount } from '../types/chain';

export interface Props {
  account: ChainAccount;
  onPress?: ((account: ChainAccount) => void) | undefined;
}

export function AccountCard(props: Props): JSX.Element {
  const { onPress, account } = props;
  const handleOnPress = () => {
    if (onPress !== undefined) {
      onPress(account);
    }
  };

  return (
    <TouchableHighlight onPress={handleOnPress}>
      <View>
        {/* <Text>Name: {account.name}</Text> */}
        <Text>Address: {account.address}</Text>
      </View>
    </TouchableHighlight>
  );
}
