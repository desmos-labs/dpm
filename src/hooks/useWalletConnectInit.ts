import WalletConnect, {CLIENT_EVENTS} from "@walletconnect/client";
import {useRecoilCallback, useRecoilState, useSetRecoilState} from "recoil";
import WalletConnectStore from "../store/WalletConnectStore";
import {useEffect} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {SessionTypes} from "@walletconnect/types";

export type WalletNotInitialized = {
    initialized: false
}

export type WalletInitialized = {
    initialized: true
    client: WalletConnect
}

export type WalletConnectClient = WalletNotInitialized | WalletInitialized;

async function initWalletConnect(): Promise<WalletConnect> {
    return await WalletConnect.init({
        controller: true,
        relayProvider: "wss://relay.walletconnect.org",
        metadata: {
            name: "Desmos Profile Manager",
            description: "Desmos Profile Manager",
            url: "#",
            icons: ["https://raw.githubusercontent.com/forbole/big-dipper-networks/main/logos/desmos.svg"],
        },
        storageOptions: {
            // @ts-ignore
            asyncStorage: AsyncStorage,
        },
        logger: 'info'
    });
}

export default function useWalletConnectInit(): WalletConnectClient {
    const [walletConnect, setWalletConnect] = useRecoilState(WalletConnectStore.walletConnect);
    const setSettledSessions = useSetRecoilState(WalletConnectStore.settledSessions);

    const onSessionCreated = useRecoilCallback(state => {
        return (params: SessionTypes.Created) => {
            state.set(WalletConnectStore.settledSessions, (sessions: SessionTypes.Settled[]) => {
                return [...sessions, params]
            })
        }
    });

    const onSessionDeleted = useRecoilCallback(state => {
        return (params: SessionTypes.Created) => {
            console.log("onSessionDeleted", params);
            state.set(WalletConnectStore.settledSessions, (sessions: SessionTypes.Settled[]) => {
                return sessions.filter(s => s.topic != params.topic);
            })
        }
    });

    useEffect(() => {
        if (walletConnect === undefined) {
            initWalletConnect()
                .then((client) => {
                    setWalletConnect(client);
                    setSettledSessions(client.session.values);
                    client.on(CLIENT_EVENTS.session.created, onSessionCreated);
                    client.on(CLIENT_EVENTS.session.deleted, onSessionDeleted);
                });
        }
        return () => {
            if (walletConnect !== undefined) {
                walletConnect.removeListener(CLIENT_EVENTS.session.created, onSessionCreated);
                walletConnect.removeListener(CLIENT_EVENTS.session.deleted, onSessionDeleted);
            }
        }
    }, [walletConnect]);

    if (walletConnect === undefined) {
        return {
            initialized: false
        }
    }
    else {
        return {
            initialized: true,
            client: walletConnect
        }
    }
}