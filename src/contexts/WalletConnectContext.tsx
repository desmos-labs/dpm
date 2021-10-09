import React, {useCallback, useEffect, useState} from "react";
import WalletConnect, {CLIENT_EVENTS} from "@walletconnect/client";
import {SessionTypes} from "@walletconnect/types";
import {SessionRequest, WalletConnectRequestEvent} from "../types/walletconnect";
import AsyncStorage from "@react-native-async-storage/async-storage";
import parseRpcRequest from "../utilils/jsonRpcParse";
import walletConnectRejectResponse from "../utilils/walletConnectRejectResponse";

type WalletConnectInitState = {
    initializing: boolean,
    error?: string
}

interface WalletConnectState {
    initState: WalletConnectInitState,
    initWalletConnect: () => Promise<void>,
    closeWalletConnect: () => Promise<void>,
    client: WalletConnect | null,
    sessions: SessionTypes.Settled[],
    setSessions: React.Dispatch<React.SetStateAction<SessionTypes.Settled[]>>,
    sessionRequests: SessionRequest[],
    setSessionRequests: React.Dispatch<React.SetStateAction<SessionRequest[]>>,
}

async function createClient(): Promise<WalletConnect> {
    return await WalletConnect.init({
        controller: true,
        relayProvider: 'wss://relay.walletconnect.org',
        metadata: {
            name: 'Desmos Profile Manager',
            description: 'Desmos Profile Manager',
            url: '#',
            icons: [
                'https://raw.githubusercontent.com/forbole/big-dipper-networks/main/logos/desmos.svg',
            ],
        },
        storageOptions: {
            // @ts-ignore
            asyncStorage: AsyncStorage,
        },
        logger: __DEV__ ? 'info' : undefined,
    });
}

function validateWalletConnectRequest(
    requestEvent: SessionTypes.RequestEvent,
): WalletConnectRequestEvent | null {
    const rpcRequest = parseRpcRequest(requestEvent.request);
    if (rpcRequest === null) {
        return null;
    }
    return {
        ...requestEvent,
        request: rpcRequest,
    };
}

// @ts-ignore
const WalletConnectContext = React.createContext<WalletConnectState>({});

export const WalletContextProvider: React.FC = ({children}) => {
    const [initState, setInitState] = useState<WalletConnectInitState>({
        initializing: false,
    });
    const [client, setClient] = useState<WalletConnect | null>(null);
    const [sessions, setSessions] = useState<SessionTypes.Settled[]>([]);
    const [sessionRequests, setSessionRequests] = useState<SessionRequest[]>([]);

    const onSessionCreated = useCallback((session: SessionTypes.Created) => {
        setSessions(currentSessions => [...currentSessions, session]);
    }, []);

    const onSessionDeleted = useCallback((session: SessionTypes.Created) => {
        setSessions(sessions => sessions.filter(s => s.topic != session.topic));
    }, []);


    const onSessionRequest = useCallback(async (requestEvent: SessionTypes.RequestEvent) => {
        if (client === null) {
            console.error("Can't handle wallet connect request, the client is null");
            return;
        }
        const validatedRequest = validateWalletConnectRequest(requestEvent);
        if (validatedRequest === null) {
            const errMsg = `Unsupported request: ${requestEvent.request.method}`;
            await client.respond(walletConnectRejectResponse(requestEvent, errMsg));
            return;
        }

        const session = await client.session.get(requestEvent.topic);
        setSessionRequests(requests => [...requests, {
            session,
            request: validatedRequest,
        }])
    }, [client]);

    useEffect(() => {
        if (client !== null) {
            // Subscribe to client events
            client.on(CLIENT_EVENTS.session.created, onSessionCreated);
            client.on(CLIENT_EVENTS.session.deleted, onSessionDeleted);
            client.on(CLIENT_EVENTS.session.request, onSessionRequest);
        }
        return () => {
            if (client !== null) {
                client.removeListener(CLIENT_EVENTS.session.created, onSessionCreated);
                client.removeListener(CLIENT_EVENTS.session.deleted, onSessionDeleted);
                client.removeListener(CLIENT_EVENTS.session.request, onSessionRequest);
            }
        }
    }, [client, onSessionCreated, onSessionDeleted, onSessionRequest]);

    useEffect(() => {
        if (client !== null) {
            client.session.history.pending.forEach(onSessionRequest);
        }
    }, [client, onSessionRequest])

    const initWalletConnect = useCallback(async () => {
        try {
            setInitState({
                initializing: true,
            })
            const client = await createClient();
            setClient(client);
            setSessions(client.session.values);
            setInitState({
                initializing: false,
            })
        } catch (e) {
            setInitState({
                initializing: false,
                error: e.toString(),
            })
        }
    }, []);

    const closeWalletConnect = useCallback(async () => {
        if (client !== null) {
            setClient(null);
        }
    }, [client]);

    return <WalletConnectContext.Provider value={{
        initState,
        initWalletConnect,
        closeWalletConnect,
        client,
        sessions,
        setSessions,
        sessionRequests,
        setSessionRequests,
    }}>
        {children}
    </WalletConnectContext.Provider>
}

export const useWalletConnectContext = () : WalletConnectState => React.useContext(WalletConnectContext);