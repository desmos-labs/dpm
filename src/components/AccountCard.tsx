import React from 'react';
import {ChainAccount} from '../types/chain';
import {
    GestureResponderEvent,
    Text,
    TouchableHighlight,
    View,
} from 'react-native';

export interface Props {
    account: ChainAccount;
    onPress?: ((account: ChainAccount) => void) | undefined;
}

export default function AccountCard(props: Props): JSX.Element {
    const handleOnPress = (_: GestureResponderEvent) => {
        if (props.onPress !== undefined) {
            props.onPress(props.account);
        }
    };

    return (
        <TouchableHighlight onPress={handleOnPress}>
            <View>
                <Text>Name: {props.account.name}</Text>
                <Text>Address: {props.account.address}</Text>
            </View>
        </TouchableHighlight>
    );
}
