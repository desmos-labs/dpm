import { ISessionParams, IWalletConnectSession } from '@walletconnect/types';
import WalletConnect from '@walletconnect/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { toHex } from '@cosmjs/encoding';
import { AuthInfo, TxBody } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import {
  CallRequestEvent,
  ConnectedEvent,
  DisconnectedEvent,
  Events,
  PeerMeta,
  Session,
  SessionRequestDetails,
  SessionRequestEvent,
  SessionUpdateEvent,
} from '../types/walletconnect';
import { SignedCosmosTx } from '../types/tx';
import { CosmosMethod } from '../types/jsonRpCosmosc';

/**
 * Type that represents the payload returned from the
 * WalletConnect `session_request` event.
 */
type SessionRequestPayload = {
  params: ISessionParams[];
};

/**
 * Type that represents the payload received on
 * `call_request` event.
 */
type WalletConnectCallRequestPayload = {
  id: number;
  method: string;
  params: string[];
};

type ConnectedEventCallback = (event: ConnectedEvent) => void;
type DisconnectedEventCallback = (event: DisconnectedEvent) => void;
type SessionRequestEventCallback = (event: SessionRequestEvent) => void;
type SessionUpdateEventCallback = (event: SessionUpdateEvent) => void;
type CallRequestEventCallback = (event: CallRequestEvent) => void;
/**
 * Type that represents a callback to emit the WalletConnectController events.
 */
type EventCallBack =
  | ConnectedEventCallback
  | DisconnectedEventCallback
  | SessionRequestEventCallback
  | SessionUpdateEventCallback
  | CallRequestEventCallback;

/**
 * Type that represents a WalletConnect session.
 */
type WalletConnectSession = {
  client: WalletConnect;
  creationDate: Date;
};

/**
 * Type that represents a serialized WalletConnect session.
 */
type SerializedWalletConnectSession = {
  id: string;
  session: IWalletConnectSession;
  creationDate: string;
};

/**
 * Keys used to store the WalletConnectController state to
 * the device storage.
 */
const STORAGE_KEYS = {
  sessions: 'WalletConnectController_sessions',
};

/**
 * Class that manage multiple WalletConnect session and
 * storing them on the device storage.
 */
export default class WalletConnectController {
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
  private readonly _sessions: Map<string, WalletConnectSession>;

  constructor() {
    this.eventsObservers = new Map();
    this._sessions = new Map();
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
    observers.forEach((observer) => {
      observer(eventPayload);
    });
  }

  /**
   * Destroy a WalletConnect session.
   * @param sessionId - Id of the session that will be terminated.
   * @private
   */
  private destroySessionClient(sessionId: string) {
    const session = this._sessions.get(sessionId);
    if (session) {
      const { client } = session;
      client.off('connect');
      client.off('disconnect');
      client.off('session_update');
      client.off('session_request');
      client.off('call_request');
      this._sessions.delete(sessionId);
    }
  }

  /**
   * Gets the client that is currently managing a session.
   * If the client don't exist this method will throw an exception.
   * @param sessionId - Id of the session of interest.
   * @private
   */
  private clientOrThrow(sessionId: string): WalletConnect {
    const session = this._sessions.get(sessionId);
    if (session === undefined) {
      throw new Error(`Can't fin client for session: ${sessionId}`);
    }
    return session.client;
  }

  /**
   * Saves all the WalletConnect session to the disk.
   * @private
   */
  private async saveSessionsToDisk(): Promise<void> {
    const sessions: SerializedWalletConnectSession[] = Array.from(this._sessions.values())
      .filter((session) => session.client.connected)
      .map((session) => ({
        id: session.client.clientId,
        session: session.client.session,
        creationDate: session.creationDate.toISOString(),
      }));
    const serializedSessions = JSON.stringify(sessions);
    await AsyncStorage.setItem(STORAGE_KEYS.sessions, serializedSessions);
  }

  /**
   * Loads the saved WalletConnect sessions from the device disk.
   * @private
   */
  private async loadSessionsFromDisk(): Promise<SerializedWalletConnectSession[]> {
    try {
      const jsonSessions = await AsyncStorage.getItem(STORAGE_KEYS.sessions);
      if (jsonSessions === null) {
        return [];
      }
      return JSON.parse(jsonSessions);
    } catch (ex) {
      console.error('Error while loading WalletConnect sessions', ex);
      return [];
    }
  }

  /**
   * Callback that will be called when the session is established.
   * @param session - Object that represents the WalletConnect session.
   * @param error - Optional error that has occur.
   * @param payload - The event payload.
   * @private
   */
  private async onConnect(session: WalletConnectSession, error: Error | null, payload: any) {
    const { clientId } = session.client;
    if (error === null) {
      await this.saveSessionsToDisk();
    }
    const event: ConnectedEvent = {
      sessionId: clientId,
      error,
    };
    this.emit(Events.OnConnect, event);
  }

  /**
   * Callback that will be called when the session is terminated.
   * @param session - Object that represents the WalletConnect session.
   * @param error - Optional error that has occur.
   * @param payload - The event payload.
   * @private
   */
  private async onDisconnect(session: WalletConnectSession, error: Error | null, payload: any) {
    const { clientId } = session.client;
    if (error === null) {
      await this.saveSessionsToDisk();
    }
    const event: ConnectedEvent = {
      sessionId: clientId,
      error,
    };
    this.emit(Events.OnDisconnect, event);
    this.destroySessionClient(clientId);
  }

  /**
   * Callback that will be called when a client ask to initiate a session.
   * @param session - Object that represents the WalletConnect session.
   * @param error - Optional error that has occur.
   * @param payload - The event payload.
   * @private
   */
  private async onSessionRequest(
    session: WalletConnectSession,
    error: Error | null,
    payload: SessionRequestPayload
  ) {
    const { clientId } = session.client;
    const event: SessionRequestEvent = {
      error,
    };

    if (error === null) {
      const params = payload.params[0];
      event.sessionDetails = {
        sessionId: clientId,
        chainId: params.chainId,
        networkId: params.networkId,
        addresses: params.accounts,
        peerMeta: params.peerMeta
          ? {
              description: params.peerMeta.description,
              name: params.peerMeta.name,
              icons: params.peerMeta.icons,
              url: params.peerMeta.url,
            }
          : undefined,
      };
    }

    this.emit(Events.OnSessionRequest, event);
  }

  /**
   * Callback that will be called when the session has bee updated.
   * @param session - Object that represents the WalletConnect session.
   * @param error - Optional error that has occur.
   * @param payload - The event payload.
   * @private
   */
  private async onSessionUpdate(session: WalletConnectSession, error: Error | null, payload: any) {
    const { clientId, chainId, accounts } = session.client;
    const event: SessionUpdateEvent = {
      error,
    };
    if (error === null) {
      event.session = {
        id: clientId,
        chainId,
        accounts,
        creationDate: session.creationDate,
      };
    }

    this.emit(Events.OnSessionUpdate, event);
  }

  /**
   * Callback that will be called when the client ask for an operation.
   * @param session - Object that represents the WalletConnect session.
   * @param error - Optional error that has occur.
   * @param payload - The event payload.
   * @private
   */
  private async onCallRequest(
    session: WalletConnectSession,
    error: Error | null,
    payload?: WalletConnectCallRequestPayload
  ) {
    const { clientId } = session.client;
    const event: CallRequestEvent = {
      sessionId: clientId,
      error,
    };
    if (payload) {
      event.request = {
        id: payload.id,
        sessionId: clientId,
        method: payload.method,
        params: payload.params,
      };
    }
    this.emit(Events.OnCallRequest, event);
  }

  /**
   * Function to bind the WalletConnect client to the private callbacks to
   * manage the session lifecycle.
   * @param session - The session of interest.
   * @private
   */
  private subscribeToEvents(session: WalletConnectSession) {
    const { client } = session;
    client.on('connect', (error, payload) => this.onConnect(session, error, payload));
    client.on('disconnect', (error, payload) => this.onDisconnect(session, error, payload));
    client.on('session_update', (error, payload) => this.onSessionUpdate(session, error, payload));
    client.on('session_request', (error, payload) =>
      this.onSessionRequest(session, error, payload)
    );
    client.on('call_request', (error, payload) => this.onCallRequest(session, error, payload));
  }

  /**
   * Initialize the WalletConnect controller.
   */
  async init(): Promise<void> {
    const serializedClients = await this.loadSessionsFromDisk();
    for (const serializedClient of serializedClients) {
      const client = new WalletConnect({
        session: serializedClient.session,
        clientMeta: {
          name: 'DPM',
          description: 'Desmos Profile Manager',
          url: 'https://desmos.network/',
          icons: ['https://desmos.network/images/icons/apple-touch-icon.png'],
        },
      });
      const session: WalletConnectSession = {
        client,
        creationDate: new Date(serializedClient.creationDate),
      };
      this._sessions.set(serializedClient.id, session);
      this.subscribeToEvents(session);
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
      const client = new WalletConnect({ uri });

      const rejectTimeout = setTimeout(() => {
        client.off('session_request');
        client.killSession();
        reject(new Error('request timeout'));
      }, timeout ?? 10000);
      const onSessionRequest = async (error: Error | null, payload?: SessionRequestPayload) => {
        clearTimeout(rejectTimeout);
        client.off('session_request');
        if (payload) {
          const params = payload.params[0];
          const sessionDetails: SessionRequestDetails = {
            sessionId: client.clientId,
            chainId: params.chainId,
            networkId: params.networkId,
            addresses: params.accounts,
            peerMeta: params.peerMeta
              ? {
                  description: params.peerMeta.description,
                  name: params.peerMeta.name,
                  icons: params.peerMeta.icons,
                  url: params.peerMeta.url,
                }
              : undefined,
          };
          const session: WalletConnectSession = {
            client,
            creationDate: new Date(),
          };
          this._sessions.set(client.clientId, session);
          this.subscribeToEvents(session);
          resolve(sessionDetails);
        } else {
          reject(error ?? new Error('unknown error'));
        }
      };

      await client.createSession();
      client.on('session_request', onSessionRequest);
    });
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
    client.rejectSession({ message });
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
    return Array.from(this._sessions.values())
      .filter((session) => session.client.connected)
      .map(({ client, creationDate }) => {
        const peerMeta: PeerMeta | undefined = client.peerMeta
          ? {
              description: client.peerMeta.description,
              url: client.peerMeta.url,
              icons: client.peerMeta.icons,
              name: client.peerMeta.name,
            }
          : undefined;
        return {
          id: client.clientId,
          creationDate,
          accounts: client.accounts,
          chainId: client.chainId,
          peerMeta,
        };
      });
  }

  /**
   * Approves a request received from a DApp.
   * @param sessionId - The DApp session id.
   * @param requestId - The request id.
   * @param result - Payload that will be returned to the DApp.
   */
  approveRequest(sessionId: string, requestId: number, result: any) {
    const client = this.clientOrThrow(sessionId);
    client.approveRequest({
      id: requestId,
      result,
    });
  }

  /**
   * Approves a cosmos sign request received from a DApp.
   * @param sessionId - The DApp session id.
   * @param requestId - The request id.
   * @param signedTx - The signed transaction that will be returned to the DApp.
   */
  approveSignRequest(sessionId: string, requestId: number, signedTx: SignedCosmosTx) {
    if (signedTx.method === CosmosMethod.SignDirect) {
      const serializedTx = {
        bodyBytes: toHex(TxBody.encode(signedTx.tx.body).finish()),
        authInfoBytes: toHex(AuthInfo.encode(signedTx.tx.authInfo).finish()),
        chainId: signedTx.tx.chainId,
        accountNumber: signedTx.tx.accountNumber.toString(16),
        signature: signedTx.signature,
      };

      this.approveRequest(sessionId, requestId, serializedTx);
    } else if (signedTx.method === CosmosMethod.SignAmino) {
      const serializedTx = {
        signature: signedTx.signature,
        signDoc: signedTx.tx,
      };

      this.approveRequest(sessionId, requestId, serializedTx);
    }
  }

  /**
   * Rejects a request received from a DApp.
   * @param sessionId - The DApp session id.
   * @param requestId - The request id.
   * @param message - Error message that will be returned to the application.
   */
  rejectRequest(sessionId: string, requestId: number, message: string) {
    const client = this.clientOrThrow(sessionId);
    client.rejectRequest({
      id: requestId,
      error: {
        message,
      },
    });
  }
}
