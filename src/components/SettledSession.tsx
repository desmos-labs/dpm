import React from "react";
import {SessionTypes} from "@walletconnect/types";
import {Button, NativeSyntheticEvent, NativeTouchEvent, Text, View} from "react-native";
import useWalletConnectDisconnect, {SessionStatus} from "../hooks/useWalletConnectTerminate";

export type Props = {
    session: SessionTypes.Settled
}
export default function SettledSession(props: Props) {
    const [status, disconnect] = useWalletConnectDisconnect()

    const onDisconnectPressed = (_: NativeSyntheticEvent<NativeTouchEvent>) => {
        disconnect(props.session.topic)
    }

    if (status === null) {
        return <View>
            <Text>Topic: {props.session.topic}</Text>
            <Button title={"Disconnect"} onPress={onDisconnectPressed} />
        </View>
    } else {
        switch (status.status) {
            case SessionStatus.Disconnecting:
                return <View>
                    <Text>Disconnecting...</Text>
                </View>
            case SessionStatus.Failed:
                return <View>
                    <Text>Disconnection failed: {status.error}</Text>
                </View>

            default:
                return null;
        }
    }

}