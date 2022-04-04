import { LinkableChain, LinkableChains } from '../types/chain';

/**
 * Finds the details regarding a linkable chain from it's chain name.
 * @param chainName - Name of the chain of interest like: cosmos, osmosis, crypto.com.
 */
export default function findLinkableChainInfoByName(chainName: string): LinkableChain | undefined {
  const lowerCase = chainName.toLowerCase();
  return LinkableChains.find((linkableChain) => {
    const { name } = linkableChain.chainConfig;
    // Special case to handle both crypto.org and crypto.com
    if (name === 'crypto.org') {
      return lowerCase.indexOf('crypto.org') >= 0 || lowerCase.indexOf('crypto.com') >= 0;
    }
    return lowerCase.indexOf(name) >= 0;
  });
}
