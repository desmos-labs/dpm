import SignClient from '@walletconnect/sign-client';
import { ProposalTypes } from '@walletconnect/types';
import {
  WalletConnectGetAccountsRequest as GetAccountsRequest,
  WalletConnectSignAminoRequest as SignAminoRequest,
  WalletConnectSignDirectRequest as SignDirectRequest,
} from '@desmoslabs/desmjs-walletconnect-v2';

/**
 * Enum that contains the status of the WalletConnect client.
 */
export enum WalletConnectClientStatus {
  /**
   * The WalletConnect client is not connected.
   */
  Disconnected = 'disconnected',
  /**
   * The WalletConnect client is connecting.
   */
  Connecting = 'connecting',
  /**
   * The WalletConnect client is connected.
   */
  Connected = 'connected',
}

/**
 * Interface that represents the base state of the WalletConnect client state.
 */
interface BaseWalletConnectClientState<S extends WalletConnectClientStatus> {
  readonly status: S;
}

/**
 * Interface that represents the disconnected state of the WalletConnect client state.
 */
interface DisconnectedWalletConnectClientState
  extends BaseWalletConnectClientState<WalletConnectClientStatus.Disconnected> {}

/**
 * Interface that represents the connecting state of the WalletConnect client state.
 */
interface ConnectingWalletConnectClientState
  extends BaseWalletConnectClientState<WalletConnectClientStatus.Connecting> {}

/**
 * Interface that represents the connected state of the WalletConnect client state.
 */
interface ConnectedWalletConnectClientState
  extends BaseWalletConnectClientState<WalletConnectClientStatus.Connected> {
  readonly client: SignClient;
}

/**
 * Type that represents the state of the WalletConnect client.
 */
export type WalletConnectClientState =
  | DisconnectedWalletConnectClientState
  | ConnectingWalletConnectClientState
  | ConnectedWalletConnectClientState;

/**
 * Interface that represents a WalletConnect session.
 */
export interface WalletConnectSession {
  // Address of the account that had create this session
  readonly accountAddress: string;
  readonly topic: string;
  readonly icon: string | undefined;
  readonly name: string;
  readonly description: string | undefined;
  // RFC 3339 date
  readonly creationDate: string;
}

/**
 * Interface that represents a WalletConnect request
 * to establish a new session.
 */
export interface WalletConnectSessionProposal {
  readonly id: number;
  readonly proposal: ProposalTypes.Struct;
  readonly name: string;
  readonly description: string;
  readonly iconUri?: string;
}

interface RequestExtraField {
  accountAddress: string;
}

type WalletConnectGetAccountsRequest = GetAccountsRequest & RequestExtraField;
type WalletConnectSignAminoRequest = SignAminoRequest & RequestExtraField;
type WalletConnectSignDirectRequest = SignDirectRequest & RequestExtraField;

export type WalletConnectRequest =
  | WalletConnectGetAccountsRequest
  | WalletConnectSignAminoRequest
  | WalletConnectSignDirectRequest;
