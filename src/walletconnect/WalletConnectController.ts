import {ISessionParams, IWalletConnectSession} from "@walletconnect/types";
import WalletConnect from "@walletconnect/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    CallRequestEvent, ConnectedEvent,
    DisconnectedEvent,
    Events, PeerMeta, Session, SessionRequestDetails,
    SessionRequestEvent,
    SessionUpdateEvent
} from "../types/walletconnect";

/**
 * Type that represents the payload returned from the
 * WalletConnect `session_request` event.
 */
type SessionRequestPayload = {
    params: ISessionParams[]
}

type ConnectedEventCallback = (event: ConnectedEvent) => void;
type DisconnectedEventCallback = (event: DisconnectedEvent) => void;
type SessionRequestEventCallback = (event: SessionRequestEvent) => void;
type SessionUpdateEventCallback = (event: SessionUpdateEvent) => void;
type CallRequestEventCallback = (event: CallRequestEvent) => void;
/**
 * Type that represents the callback to emit the WalletConnectController events.
 */
type EventCallBack = ConnectedEventCallback | DisconnectedEventCallback |
    SessionRequestEventCallback | SessionUpdateEventCallback | CallRequestEventCallback;

/**
 * Type that represents a serialized WalletConnect session.
 */
type SerializedClient = {
    id: string,
    session: IWalletConnectSession
}

/**
 * Keys used to store the WalletConnectController state into
 * the device storage.
 */
const STORAGE_KEYS = {
    sessions: "WalletConnectController_sessions",
}

/**
 * Class that manage multiple WalletConnect session and
 * storing them on the device storage.
 */
export class WalletConnectController {
    /**
     * Map used to collect all the observer of each event.
     * @private
     */
    private readonly eventsObservers: Map<Events, EventCallBack[]>;
    /**
     * Map that contains all the session organized by the
     * WalletConnect `clientId` field.
     * @private
     */
    private readonly clients: Map<string, WalletConnect>;

    constructor() {
        this.eventsObservers = new Map();
        this.clients = new Map()
    }

    /**
     * Listen for an event that will be triggered from WalletConnect.
     * @param event - The event of interest.
     * @param cb - Callback that will be called when the event of interest
     * occur.
     */
    addListener(event: Events, cb: EventCallBack) {
        const list = this.eventsObservers.get(event) ?? [];
        list.push(cb);
        this.eventsObservers.set(event, [...list]);
    }

    /**
     * Stops listening for an event.
     * @param event - The event of interest.
     * @param cb - The callback to not call anymore when the event
     * of interest occur.
     */
    removeListener(event: Events, cb: EventCallBack) {
        const list = this.eventsObservers.get(event) ?? [];
        const removeIndex = list.indexOf(cb);
        if (removeIndex >= 0) {
            list.splice(removeIndex, 1);
        }
        this.eventsObservers.set(event, [...list]);
    }

    /**
     * Notify all the observer.
     * @param event - The event that has occur.
     * @param eventPayload - The data associated to the event.
     * @private
     */
    private emit(event: Events, eventPayload: any) {
        const observers = this.eventsObservers.get(event) ?? [];
        observers.forEach(observer => {
            observer(eventPayload);
        })
    }

    /**
     * Destroy a WalletConnect session.
     * @param sessionId - Id of the session that will be terminated.
     * @private
     */
    private destroySessionClient(sessionId: string) {
        const client = this.clients.get(sessionId);
        if (client) {
            client.off("connect");
            client.off("disconnect");
            client.off("session_update");
            client.off("session_request");
            client.off("call_request");
            this.clients.delete(sessionId);
        }
    }

    /**
     * Gets the client that is currently managing a session.
     * If the client don't exist this method will throw an exception.
     * @param sessionId - Id of the session of interest.
     * @private
     */
    private clientOrThrow(sessionId: string): WalletConnect {
        const client = this.clients.get(sessionId);
        if (client === undefined) {
            throw new Error(`Can't fin client with id: ${sessionId}`)
        }
        return client;
    }

    /**
     * Saves all the clients and theri session on the disk.
     * @private
     */
    private async saveClientsToDisk(): Promise<void> {
        const clients: SerializedClient[] = Array.from(this.clients.values())
            .filter(client => client.connected)
            .map(client => ({
                id: client.clientId,
                session: client.session
            }));
        const serializedClients = JSON.stringify(clients);
        await AsyncStorage.setItem(STORAGE_KEYS.sessions, serializedClients);
    }

    /**
     * Loads the saved WalletConnect clients from the device disk.
     * @private
     */
    private async loadClientsFromDisk(): Promise<SerializedClient[]> {
        try {
            const jsonClients = await AsyncStorage.getItem(STORAGE_KEYS.sessions);
            if (jsonClients === null) {
                return [];
            }
            return JSON.parse(jsonClients);
        } catch (ex) {
            console.error("Error while loading wallet connect clients", ex);
            return [];
        }
    }

    /**
     * Callback that will be called when the session is established.
     * @param client - The client that is manage the session.
     * @param error - Optional error that has occur.
     * @param payload - The event payload.
     * @private
     */
    private async onConnect(client: WalletConnect, error: Error | null, payload: any) {
        const {clientId} = client;
        if (error === null) {
            await this.saveClientsToDisk()
        }
        const event: ConnectedEvent = {
            sessionId: clientId,
            error
        }
        this.emit(Events.OnConnect, event);
    }

    /**
     * Callback that will be called when the session is terminated.
     * @param client - The client that is manage the session.
     * @param error - Optional error that has occur.
     * @param payload - The event payload.
     * @private
     */
    private async onDisconnect(client: WalletConnect, error: Error | null, payload: any) {
        const {clientId} = client;
        if (error === null) {
            await this.saveClientsToDisk()
        }
        const event: ConnectedEvent = {
            sessionId: clientId,
            error
        }
        this.emit(Events.OnDisconnect, event);
        this.destroySessionClient(clientId);
    }

    /**
     * Callback that will be called when a client ask to initiate a session.
     * @param client - The client that is manage the session.
     * @param error - Optional error that has occur.
     * @param payload - The event payload.
     * @private
     */
    private async onSessionRequest(client: WalletConnect, error: Error | null, payload: SessionRequestPayload) {
        const {clientId} = client;
        const event: SessionRequestEvent = {
            error,
        }

        if (error === null) {
            const params = payload.params[0];
            event.sessionDetails = {
                sessionId: clientId,
                chainId: params.chainId,
                networkId: params.networkId,
                addresses: params.accounts,
                peerMeta: params.peerMeta ? {
                    description: params.peerMeta.description,
                    name: params.peerMeta.name,
                    icons: params.peerMeta.icons,
                    url: params.peerMeta.url
                } : undefined,
            }
        }

        this.emit(Events.OnSessionRequest, event);
    }

    /**
     * Callback that will be called when the session has bee updated.
     * @param client - The client that is manage the session.
     * @param error - Optional error that has occur.
     * @param payload - The event payload.
     * @private
     */
    private async onSessionUpdate(client: WalletConnect, error: Error | null, payload: any) {
        console.log("on session_update", payload);
        const {clientId, chainId, accounts} = client;
        const event: SessionUpdateEvent = {
            error
        }
        if (error === null) {
            event.session = {
                id: clientId,
                chainId,
                accounts
            }
        }

        this.emit(Events.OnSessionUpdate, event);
    }

    /**
     * Callback that will be called when the client ask for an operation.
     * @param client - The client that is manage the session.
     * @param error - Optional error that has occur.
     * @param payload - The event payload.
     * @private
     */
    private async onCallRequest(client: WalletConnect, error: Error | null, payload: {
        method: string,
        params: string[],
    }) {
        const {clientId} = client;
        const event: CallRequestEvent = {
            sessionId: clientId,
            error
        }
        if (error === null) {
            event.request = {
                sessionId: clientId,
                method: payload.method,
                params: payload.params
            }
        }
        this.emit(Events.OnCallRequest, event);
    }

    /**
     * Function to bind a client to the private callbacks to
     * manage the session lifecycle.
     * @param client - The client of interest.
     * @private
     */
    private subscribeToEvents(client: WalletConnect) {
        client.on("connect", ((error, payload) => this.onConnect(client, error, payload)));
        client.on("disconnect", ((error, payload) => this.onDisconnect(client, error, payload)));
        client.on("session_update", ((error, payload) => this.onSessionUpdate(client, error, payload)));
        client.on("session_request", ((error, payload) => this.onSessionRequest(client, error, payload)));
        client.on("call_request", ((error, payload) => this.onCallRequest(client, error, payload)));
    }

    /**
     * Initialize the WalletConnect controller.
     */
    async init(): Promise<void> {
        const serializedClients = await this.loadClientsFromDisk();
        for (const serializedClient of serializedClients) {
            const client = new WalletConnect({
                session: serializedClient.session
            })
            this.clients.set(serializedClient.id, client);
            this.subscribeToEvents(client);
        }
    }

    /**
     * Initiate the connection with a DApp.
     * @param uri - The WalletConnect DApp uri.
     * @param timeout - Amount of millisecond to wait for a response
     * from the DApp. If is undefined will be used a default value of
     * 10 seconds.
     */
    async connectToDApp(uri: string, timeout?: number): Promise<SessionRequestDetails> {
        return new Promise(async (resolve, reject) => {
            const client = new WalletConnect({uri});

            const rejectTimeout = setTimeout(() => {
                client.off("session_request");
                client.rejectSession();
                reject(new Error("request timeout"));
            }, timeout ?? 10000);
            const onSessionRequest = async (error: Error | null, payload?: SessionRequestPayload) => {
                clearTimeout(rejectTimeout);
                client.off("session_request");
                if (payload) {
                    const params = payload.params[0];
                    const sessionDetails: SessionRequestDetails = {
                        sessionId: client.clientId,
                        chainId: params.chainId,
                        networkId: params.networkId,
                        addresses: params.accounts,
                        peerMeta: params.peerMeta ? {
                            description: params.peerMeta.description,
                            name: params.peerMeta.name,
                            icons: params.peerMeta.icons,
                            url: params.peerMeta.url
                        } : undefined,
                    }
                    this.clients.set(client.clientId, client);
                    this.subscribeToEvents(client);
                    resolve(sessionDetails);
                } else {
                    reject(error ?? new Error("unknown error"))
                }
            }

            await client.createSession();
            client.on("session_request", onSessionRequest)
        })
    }

    /**
     * Approves a session request received from a DApp.
     * @param id - Unique id that identify the session.
     * @param accounts - bech32 address of the account that the DApp will be able to use.
     * @param chainId - id that identify the chain that can be used.
     * 0 for mainnet and 1 for testnet.
     */
    approveSession(id: string, accounts: string[], chainId: number) {
        const client = this.clientOrThrow(id);
        client.approveSession({
            chainId,
            accounts,
        });
    }

    /**
     * Rejects a session request received from a DApp.
     * @param id - Unique id that identify the session.
     * @param message - Optional error message that will be reported to the
     * DApp.
     */
    rejectSession(id: string, message?: string): void {
        const client = this.clientOrThrow(id);
        client.rejectSession({message});
        this.destroySessionClient(id);
    }

    /**
     * Terminates an already established session.
     * @param id - Id of the session to terminate.
     */
    async terminateSession(id: string): Promise<void> {
        const client = this.clientOrThrow(id);
        await client.killSession();
        this.destroySessionClient(id);
    }

    /**
     * Gets all the current active sessions.
     */
    get sessions(): Session[] {
        return Array.from(this.clients.values())
            .filter(client => client.connected)
            .map(client => {
                const peerMeta: PeerMeta | undefined = client.peerMeta ? {
                    description: client.peerMeta.description,
                    url: client.peerMeta.url,
                    icons: client.peerMeta.icons,
                    name: client.peerMeta.name,
                } : undefined
                return {
                    id: client.clientId,
                    accounts: client.accounts,
                    chainId: client.chainId,
                    peerMeta
                }
            })
    }
}
