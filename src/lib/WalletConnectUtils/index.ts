import { ProposalTypes, SessionTypes, SignClientTypes } from '@walletconnect/types';
import {
  WalletConnectRequest,
  WalletConnectSession,
  WalletConnectSessionProposal,
} from 'types/walletConnect';

/**
 * Function that converts a WalletConnect session to ours
 * representation.
 * @param session - The session to convert.
 */
export const convertWalletConnectSession = (
  session: SessionTypes.Struct,
): WalletConnectSession => ({
  session,
});

/**
 * Function that converts a WalletConnect session proposal to ours
 * representation.
 * @param proposal - The proposal to convert.
 */
export const convertWalletConnectSessionProposal = (
  proposal: ProposalTypes.Struct,
): WalletConnectSessionProposal => ({
  proposal,
});

/**
 * Function that converts a WalletConnect request to ours
 * representation.
 * @param request - The request to convert.
 */
export const convertWalletConnectRequest = (
  request: SignClientTypes.EventArguments['session_request'],
): WalletConnectRequest => ({
  request,
});
