import React, {useCallback, useEffect, useMemo, useState} from "react";
import {WalletConnectController} from "../walletconnect/WalletConnectController";
import {CallRequestEvent, Events, ParsedCallRequest} from "../types/walletconnect";
import parseCallRequest from "../utilils/jsonRpcParse";

type WalletConnectInitState = {
    initializing: boolean,
    initialized?: boolean,
    error?: string
}

interface WalletConnectState {
    initState: WalletConnectInitState,
    initWalletConnect: () => void,
    controller: WalletConnectController
    callRequests: ParsedCallRequest[],
    removeCallRequest: (requestId: number) => void,
}

// @ts-ignore
const WalletConnectContext = React.createContext<WalletConnectState>({});

export const WalletContextProvider: React.FC = ({children}) => {
    const [initState, setInitState] = useState<WalletConnectInitState>({
        initializing: false,
    });
    const controller = useMemo(() => new WalletConnectController(), [])
    const [callRequests, setCallRequests] = useState<ParsedCallRequest[]>([]);

    const initWalletConnect = useCallback(() => {
        (async () => {
            setInitState({
                initializing: true,
            })
            try {
                await controller.init();
                setInitState({
                    initializing: false,
                    initialized: true,
                })
            } catch (e) {
                setInitState({
                    initializing: false,
                    error: e.toString(),
                })
                console.error("WalletConnectController init failed", e);
            }
        })()
    }, [controller]);

    const onCallRequest = useCallback((event: CallRequestEvent) => {
        if (event.request) {
            const parsed = parseCallRequest(event.request);
            if (parsed === null) {
                const {id, sessionId, method} = event.request;
                controller.rejectRequest(sessionId, id, `Invalid request method ${method}`);
            }
            else {
                setCallRequests(old => [...old, parsed])
            }
        }
    }, [controller])

    const removeCallRequest = useCallback((requestId: number) => {
        setCallRequests(oldRequest => oldRequest.filter(r => r.requestId !== requestId))
    }, [])

    useEffect(() => {
        controller.addListener(Events.OnCallRequest, onCallRequest);
        return () => {
            controller.removeListener(Events.OnCallRequest, onCallRequest);
        }
    }, [controller, onCallRequest]);

    return <WalletConnectContext.Provider value={{
        initState,
        initWalletConnect,
        controller,
        callRequests,
        removeCallRequest,
    }}>
        {children}
    </WalletConnectContext.Provider>
}

export const useWalletConnectContext = () : WalletConnectState => React.useContext(WalletConnectContext);