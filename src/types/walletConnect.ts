import SignClient from '@walletconnect/sign-client';
import { ProposalTypes, SessionTypes, SignClientTypes } from '@walletconnect/types';

/**
 * Requests that can be received from WalletConnect.
 */
export enum CallRequestType {
  GetAccounts = 'cosmos_getAccounts',
  SignDirect = 'cosmos_signDirect',
  SignAmino = 'cosmos_signAmino',
}

/**
 * Interface that represents a WalletConnect client.
 */
export interface WalletConnectClient {
  readonly client: SignClient;
}

/**
 * Interface that represents a WalletConnect session.
 */
export interface WalletConnectSession {
  readonly session: SessionTypes.Struct;
}

/**
 * Interface that represents a WalletConnect request
 * to establish a new session.
 */
export interface WalletConnectSessionProposal {
  readonly proposal: ProposalTypes.Struct;
}

/**
 * Interface that represents a WalletConnect request
 * to exec an operation.
 */
export interface WalletConnectRequest {
  readonly request: SignClientTypes.EventArguments['session_request'];
}
