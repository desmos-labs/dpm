export enum Events {
    OnConnect = "connect",
    OnDisconnect = "disconnect",
    OnSessionRequest = "session_request",
    OnSessionUpdate = "session_update",
    OnCallRequest = "call_request"
}

export type Session = {
    id: string,
    creationDate: Date,
    accounts: string[],
    chainId: number,
    peerMeta?: PeerMeta
}

export type PeerMeta = {
    description: string;
    url: string;
    icons: string[];
    name: string;
}
export type ConnectedEvent = {
    sessionId: string,
    error: Error | null,
}
export type DisconnectedEvent = {
    sessionId: string,
    error: Error | null,
}
export type SessionRequestDetails = {
    sessionId: string,
    chainId: number | null,
    networkId: number | null,
    addresses: string[] | null,
    peerMeta?: PeerMeta
}
export type SessionRequestEvent = {
    error: Error | null,
    sessionDetails?: SessionRequestDetails
}
export type SessionUpdateEvent = {
    error: Error | null,
    session?: Session
}

export type CallRequest = {
    id: number,
    sessionId: string,
    method: string,
    params: any[]
}

export type CallRequestEvent = {
    sessionId: string,
    error: Error | null,
    request?: CallRequest
}