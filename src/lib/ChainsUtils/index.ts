import { ChainLink, SupportedChain } from 'types/chains';
import SupportedChains from 'config/LinkableChains';
import { WalletType } from 'types/wallet';
import { AccountWithWallet } from 'types/account';
import { bech32AddressToAny } from '@desmoslabs/desmjs/build/aminomessages/profiles';
import { Bech32Address } from '@desmoslabs/desmjs-types/desmos/profiles/v3/models_chain_links';
import { DesmosMainnet, DesmosTestnet } from '@desmoslabs/desmjs';

/**
 * List of chains that are currently supported within the Desmos wallet.
 */
export const SUPPORTED_CHAINS = [DesmosMainnet, DesmosTestnet];

/**
 * Finds the details regarding a linkable chain from its chain name.
 */
export const getLinkableChainInfoByName = (chainName: string): SupportedChain | undefined => {
  const lowerCase = chainName.toLowerCase();
  return SupportedChains.find((linkableChain) => {
    const { name } = linkableChain.chainConfig;
    // Special case to handle both crypto.org and crypto.com
    if (name === 'crypto.org') {
      return lowerCase.indexOf('crypto.org') >= 0 || lowerCase.indexOf('crypto.com') >= 0;
    }
    return lowerCase.indexOf(name) >= 0;
  });
};

/**
 * Format an incoming chain link data from the server into a format that is easier to parse by the app.
 * @param {any} chainLink - Chain link data retrieved from the server.
 * @returns {ChainLink[]} - An array of formatted ChainLink objects
 */
export const convertGraphQLChainLink = (chainLink: any) =>
  ({
    chainName: chainLink.chainConfig.name,
    externalAddress: chainLink.externalAddress,
    userAddress: chainLink.userAddress,
    proof: {
      plainText: chainLink.proof.plainText,
      signature: chainLink.proof.signature,
    },
    creationTime: new Date(`${chainLink.creationTime}Z`),
  } as ChainLink);

/**
 * Gets the address data to be used when linking an exteranl chain, based on the given
 * {@param chain} and {@param account} data.
 */
export const getAddress = (chain: SupportedChain, account: AccountWithWallet) =>
  bech32AddressToAny(
    Bech32Address.fromPartial({
      value: account.account.address,
      prefix: chain.prefix,
    }),
  );

/**
 * Return the supported types of wallet that can be created for a chain.
 * @param chain - The chain of interest.
 */
// eslint-disable-next-line no-unused-vars
export const getChainSupportedWalletTypes = (chain: SupportedChain): WalletType[] =>
  // Return all since at the moment all the chains support those methods.
  [WalletType.Mnemonic, WalletType.Ledger];
