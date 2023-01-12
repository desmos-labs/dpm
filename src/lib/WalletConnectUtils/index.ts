import { ProposalTypes, SignClientTypes } from '@walletconnect/types';
import { WalletConnectRequest, WalletConnectSessionProposal } from 'types/walletConnect';
import { Account } from 'types/account';
import { WalletType } from 'types/wallet';
import { CosmosRPCMethods } from '@desmoslabs/desmjs-walletconnect-v2';
import { desmosIconOrange } from 'assets/images';
import BaseEventArgs = SignClientTypes.BaseEventArgs;

/**
 * Function that converts a WalletConnect session proposal to ours
 * representation.
 * @param proposal - The proposal to convert.
 */
export const convertWalletConnectSessionProposal = (
  proposal: Omit<BaseEventArgs<ProposalTypes.Struct>, 'topic'>,
): WalletConnectSessionProposal => ({
  proposal: proposal.params,
  id: proposal.id,
  name: proposal.params.proposer.metadata.name,
  description: proposal.params.proposer.metadata.description,
  iconUri: proposal.params.proposer.metadata.icons[0],
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

/**
 * Converts a wallet connect session icon uri to a [ImageSource] that can
 * be used to display the DApp icon in a [Image] component.
 * @param iconUri - WalletConnect session icon uri.
 */
export const walletConnectIconUriToImageSource = (iconUri: string | undefined) => {
  if (iconUri === undefined) {
    return desmosIconOrange;
  }
  try {
    const url = new URL(iconUri);
    if (url.protocol.indexOf('http') === 0 && url.hostname !== 'localhost') {
      return { uri: iconUri };
    }
    return desmosIconOrange;
  } catch (e) {
    return desmosIconOrange;
  }
};
