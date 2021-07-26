import React from "react";
import {PairingTypes, SessionTypes} from "@walletconnect/types";
import {Button, NativeSyntheticEvent, NativeTouchEvent, Text, View} from "react-native";
import useWalletConnectDisconnect, {SessionStatus} from "../hooks/useWalletConnectTerminate";
import {useRecoilValue} from "recoil";
import WalletConnectStore from "../store/WalletConnectStore";

export type Props = {
    session: SessionTypes.Settled
}
export default function SettledSession(props: Props) {
    const client = useRecoilValue(WalletConnectStore.walletConnect)!;
    const [status, disconnect] = useWalletConnectDisconnect(client)

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