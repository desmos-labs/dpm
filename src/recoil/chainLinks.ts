import React from 'react';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';
import { getMMKV, MMKVKEYS, setMMKV } from 'lib/MMKVStorage';
import { ChainLink } from 'types/desmos';

/**
 * Recoil atom that holds all the chain links of all the profiles stored inside the application.
 */
const chainLinksAppState = atom<Record<string, ChainLink[]>>({
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

interface UniqueChainLinkInfo {
  readonly chainName: string;
  readonly externalAddress: string;
}

const getUniqueLinkInfo = (link: ChainLink) =>
  ({
    chainName: link.chainName,
    externalAddress: link.externalAddress,
  } as UniqueChainLinkInfo);

const findLinkByUniqueInfo = (chainLink: ChainLink[], info: UniqueChainLinkInfo) =>
  chainLink.find(
    (link) => link.chainName === info.chainName && link.externalAddress === info.externalAddress,
  );

const mergeChainLinks = (first: ChainLink[], second: ChainLink[]) => {
  // Get the unique chain links data
  const uniqueChainLinks: Set<string> = new Set();
  first.map(getUniqueLinkInfo).forEach((value) => uniqueChainLinks.add(JSON.stringify(value)));
  second.map(getUniqueLinkInfo).forEach((value) => uniqueChainLinks.add(JSON.stringify(value)));

  return Array.from(uniqueChainLinks)
    .map((value) => JSON.parse(value) as UniqueChainLinkInfo)
    .map((info) => findLinkByUniqueInfo(second, info) || findLinkByUniqueInfo(first, info))
    .filter((value) => value)
    .sort((a, b) => a!.chainName.localeCompare(b!.chainName)) as ChainLink[];
};

/**
 * Hook that allows storing a list of chain links associated with the same user inside the application state.
 */
export const useStoreUserChainLinks = () => {
  const setChainLinks = useSetRecoilState(chainLinksAppState);
  return React.useCallback(
    (user: string, chainLinks: ChainLink[]) => {
      setChainLinks((currentChainLinks) => {
        const existingChainLinks = currentChainLinks[user] || [];
        const mergedLinks = mergeChainLinks(existingChainLinks, chainLinks);

        const newChainLinks: Record<string, ChainLink[]> = {
          ...currentChainLinks,
        };
        newChainLinks[user] = mergedLinks;
        return newChainLinks;
      });
    },
    [setChainLinks],
  );
};
