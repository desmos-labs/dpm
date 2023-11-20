import SignClient from '@walletconnect/sign-client';
import { ProposalTypes } from '@walletconnect/types';
import {
  WalletConnectGetAccountsRequest as GetAccountsRequest,
  WalletConnectSignAminoRequest as SignAminoRequest,
  WalletConnectSignDirectRequest as SignDirectRequest,
} from '@desmoslabs/desmjs-walletconnect-v2';

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
