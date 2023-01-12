import SignClient from '@walletconnect/sign-client';
import { ProposalTypes, SignClientTypes } from '@walletconnect/types';

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
  // Address of the account that had create this session
  readonly accountAddress: string;
  readonly topic: string;
  readonly icon: string | undefined;
  readonly name: string;
  readonly description: string | undefined;
  readonly url: string;
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

/**
 * Interface that represents a WalletConnect request
 * to exec an operation.
 */
export interface WalletConnectRequest {
  readonly request: SignClientTypes.EventArguments['session_request'];
}
