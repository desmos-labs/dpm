import SignClient from '@walletconnect/sign-client';
import { ProposalTypes, SessionTypes, SignClientTypes } from '@walletconnect/types';

/**
 * Interface that represents a WalletConnect client.
 */
export interface WalletConnectClient {
  readonly client: SignClient;
}

export enum WalletConnectPermission {
  SIGN_TX,
  BROADCAST_TX,
}

/**
 * Interface that represents a WalletConnect session.
 */
export interface WalletConnectSession {
  readonly session?: SessionTypes.Struct;

  readonly id: string;
  readonly icon: string | undefined;
  readonly name: string;
  readonly description: string | undefined;
  readonly url: string;
  readonly creationDate: Date;
  readonly permissions: WalletConnectPermission[];
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
