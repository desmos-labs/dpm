import { ProposalTypes, SignClientTypes } from '@walletconnect/types';
import { WalletConnectRequest, WalletConnectSessionProposal } from 'types/walletConnect';
import { Account } from 'types/account';
import { WalletType } from 'types/wallet';
import { CosmosRPCMethods } from '@desmoslabs/desmjs-walletconnect-v2';

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

export const getAccountSupportedMethods = (account: Account): string[] => {
  const walletMethods: string[] = [];

  switch (account.walletType) {
    case WalletType.Ledger:
      walletMethods.push(CosmosRPCMethods.GetAccounts, CosmosRPCMethods.SignAmino);
      break;
    case WalletType.Mnemonic:
    case WalletType.Web3Auth:
      walletMethods.push(
        CosmosRPCMethods.GetAccounts,
        CosmosRPCMethods.SignAmino,
        CosmosRPCMethods.SignDirect,
      );
      break;
    default:
      break;
  }

  return walletMethods;
};
