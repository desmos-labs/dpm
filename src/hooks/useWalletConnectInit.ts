import WalletConnect, {CLIENT_EVENTS} from '@walletconnect/client';
import {useRecoilCallback, useRecoilState, useSetRecoilState} from 'recoil';
import WalletConnectStore, {
    SessionRequest,
    WalletConnectRequestEvent,
} from '../store/WalletConnectStore';
import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SessionTypes} from '@walletconnect/types';
import parseRpcRequest from '../utilils/jsonRpcParse';
import walletConnectRejectResponse from '../utilils/walletConnectRejectResponse';
import Deferred from '../types/defered';

export type WalletNotInitialized = {
    initialized: false;
};

export type WalletInitialized = {
    initialized: true;
    client: WalletConnect;
};

export type WalletConnectClient = WalletNotInitialized | WalletInitialized;

async function initWalletConnect(): Promise<WalletConnect> {
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
        logger: 'info',
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

export default function useWalletConnectInit(): Deferred<WalletConnect> {
    const [walletConnectStatus, setWalletConnectStatus] = useState<Deferred<WalletConnect>>(Deferred.pending());
    const [walletConnect, setWalletConnect] = useRecoilState(
        WalletConnectStore.walletConnect,
    );
    const setSettledSessions = useSetRecoilState(
        WalletConnectStore.settledSessions,
    );

    const onSessionCreated = useRecoilCallback(state => {
        return (params: SessionTypes.Created) => {
            state.set(
                WalletConnectStore.settledSessions,
                (sessions: SessionTypes.Settled[]) => {
                    return [...sessions, params];
                },
            );
        };
    });

    const onSessionDeleted = useRecoilCallback(state => {
        return (params: SessionTypes.Created) => {
            state.set(
                WalletConnectStore.settledSessions,
                (sessions: SessionTypes.Settled[]) => {
                    return sessions.filter(s => s.topic != params.topic);
                },
            );
        };
    });

    const onSessionRequest = useRecoilCallback(state => {
        return async (requestEvent: SessionTypes.RequestEvent) => {
            const client = state.snapshot
                .getLoadable(WalletConnectStore.walletConnect)
                .getValue()!;

            const validatedRequest = validateWalletConnectRequest(requestEvent);
            if (validatedRequest === null) {
                const errMsg = `Unsupported request: ${requestEvent.request.method}`;
                await client.respond(walletConnectRejectResponse(requestEvent, errMsg));
                return;
            }

            const session = await client.session.get(requestEvent.topic);
            state.set(
                WalletConnectStore.sessionRequests,
                (requests: SessionRequest[]) => {
                    return [
                        ...requests,
                        {
                            session,
                            request: validatedRequest,
                        },
                    ];
                },
            );
        };
    });

    useEffect(() => {
        if (walletConnect === undefined) {
            initWalletConnect()
                .then(client => {
                    setWalletConnect(client);
                    setSettledSessions(client.session.values);
                    // Subscribe to client events
                    client.on(CLIENT_EVENTS.session.created, onSessionCreated);
                    client.on(CLIENT_EVENTS.session.deleted, onSessionDeleted);
                    client.on(CLIENT_EVENTS.session.request, onSessionRequest);
                    // Process the pending requests.
                    client.session.history.pending.forEach(onSessionRequest);
                    setWalletConnectStatus(Deferred.completed(client));
                })
                .catch(ex => setWalletConnectStatus(Deferred.failed(ex.toString())));
        }
        return () => {
            if (walletConnect !== undefined) {
                walletConnect.removeListener(
                    CLIENT_EVENTS.session.created,
                    onSessionCreated,
                );
                walletConnect.removeListener(
                    CLIENT_EVENTS.session.deleted,
                    onSessionDeleted,
                );
                walletConnect.removeListener(
                    CLIENT_EVENTS.session.request,
                    onSessionRequest,
                );
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [walletConnect]);

    return walletConnectStatus;
}
