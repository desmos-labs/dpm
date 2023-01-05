import { LinkableChain } from 'types/chains';
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
