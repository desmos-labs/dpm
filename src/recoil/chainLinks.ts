import React from 'react';
import { atom, useRecoilState, useRecoilValue } from 'recoil';
import { getMMKV, MMKVKEYS, setMMKV } from 'lib/MMKVStorage';
import { ChainLink } from 'types/desmos';

/**
 * Recoil atom that holds all the chain links of all the profiles stored niisde the application.
 */
export const chainLinksAppState = atom<Record<string, ChainLink[]>>({
  key: 'chainLinks',
  default: getMMKV(MMKVKEYS.CHAIN_LINKS) || {},
  effects: [
    ({ onSet }) => {
      onSet((newChainLinks) => {
        setMMKV(MMKVKEYS.CHAIN_LINKS, newChainLinks);
      });
    },
  ],
});

/**
 * Hook that allows to easily get the currently stored chain links.
 */
export const useStoredChainLinks = () => useRecoilValue(chainLinksAppState);

/**
 * Hook that allows storing a new chain link inside the application state.
 */
export const useStoreChainLink = () => {
  const [, setChainLinks] = useRecoilState(chainLinksAppState);
  return React.useCallback(
    (chainLink: ChainLink) => {
      setChainLinks((currentChainLinks) => {
        const existing = new Set(currentChainLinks[chainLink.userAddress] || []);
        existing.add(chainLink);
        const newChainLinks: Record<string, ChainLink[]> = {
          ...currentChainLinks,
        };
        newChainLinks[chainLink.userAddress] = Array.from(existing);
        return newChainLinks;
      });
    },
    [setChainLinks],
  );
};

/**
 * Hook that allows storing a list of chain links associated with the same user inside the application state.
 */
export const useStoreUserChainLinks = () => {
  const [, setChainLinks] = useRecoilState(chainLinksAppState);
  return React.useCallback(
    (user: string, chainLinks: ChainLink[]) => {
      setChainLinks((currentChainLinks) => {
        const newChainLinks: Record<string, ChainLink[]> = {
          ...currentChainLinks,
        };
        newChainLinks[user] = chainLinks;
        return newChainLinks;
      });
    },
    [setChainLinks],
  );
};

export default useStoreChainLink;
