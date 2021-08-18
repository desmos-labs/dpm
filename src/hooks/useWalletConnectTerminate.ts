import WalletConnect from "@walletconnect/client";
import {useState} from "react";
import { ERROR } from "@walletconnect/utils"
import {useRecoilValue} from "recoil";
import WalletConnectStore from "../store/WalletConnectStore";

export enum SessionStatus {
    Disconnecting = "SESSION_DISCONNECTING",
    Disconnected = "SESSION_DISCONNECTED",
    Failed = "SESSION_DISCONNECT_FAILED"
}


export type SessionDisconnecting = {
    status: SessionStatus.Disconnecting
}

export type SessionDisconnected = {
    status: SessionStatus.Disconnected
}

export type SessionDisconnectFailed = {
    status: SessionStatus.Failed,
    error: string
}

export type DisconnectingSession = SessionDisconnecting | SessionDisconnected | SessionDisconnectFailed

/**
 * Hook to terminate a WalletConnect session.
 * Returns a stateful variable that provides the termination status and a function to terminate the session.
 */
export default function useWalletConnectDisconnect():
    [DisconnectingSession | null, (topic: string) => void] {
    const client = useRecoilValue(WalletConnectStore.walletConnect)!;
    const [status, setStatus] = useState<DisconnectingSession | null>(null);

    const disconnect = (topic: string) => {
        setStatus({
            status: SessionStatus.Disconnecting
        })

        client.disconnect({
            topic,
            reason: ERROR.USER_DISCONNECTED.format(),
        }).then(() => {
            setStatus({
                status: SessionStatus.Disconnected
            })
        }).catch(ex => {
            setStatus({
                status: SessionStatus.Failed,
                error: ex
            })
        });
    }

    return [status, disconnect];
}