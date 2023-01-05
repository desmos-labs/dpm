import { ChainLink, LinkableChain } from 'types/chains';
import LinkableChains from 'config/LinkableChains';

/**
 * Finds the details regarding a linkable chain from its chain name.
 */
export const getLinkableChainInfoByName = (chainName: string): LinkableChain | undefined => {
  const lowerCase = chainName.toLowerCase();
  return LinkableChains.find((linkableChain) => {
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
