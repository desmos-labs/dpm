import React from "react";
import {SessionTypes} from "@walletconnect/types";
import useWalletConnectDisconnect, {SessionStatus} from "../hooks/useWalletConnectTerminate";
import {IconButton, List} from "react-native-paper";
import {IconSource} from "react-native-paper/src/components/Icon";
import {useTranslation} from "react-i18next";

export type Props = {
    session: SessionTypes.Settled
}
export default function SettledSession(props: Props) {
    const [status, disconnect] = useWalletConnectDisconnect()
    const {t} = useTranslation();

    const onDisconnectPressed = () => {
        disconnect(props.session.topic)
    }

    if (status === null) {
        const icons = props.session.peer.metadata.icons;
        let icon: IconSource = "puzzle"
        if (icons.length > 0) {
            icon = {
                uri: props.session.peer.metadata.icons[0]
            }
        }
        return <List.Item
            title={props.session.peer.metadata.name}
            description={props.session.peer.metadata.url}
            left={() => <List.Icon icon={icon}/>}
            right={() => <IconButton
                icon="close-circle-outline"
                onPress={onDisconnectPressed}
            />}
        />
    } else {
        switch (status.status) {
            case SessionStatus.Disconnecting:
                return <List.Item
                    title={t("disconnecting")}
                />
            case SessionStatus.Failed:
                return <List.Item
                    title={`${t("an error occurred")}: ${status.error}`}
                />

            default:
                return null;
        }
    }

}