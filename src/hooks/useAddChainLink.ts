import { useCallback } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { ChainLink } from '../types/link';

export default function useAddChinLink(address: string): (link: ChainLink) => void {
  const { setChainLinks } = useAppContext();

  return useCallback(
    (link: ChainLink) => {
      setChainLinks((old) => {
        const currentLinks = old[address] ?? [];
        const newState = {
          ...old,
        };
        newState[address] = [...currentLinks, link];
        return newState;
      });
    },
    [address, setChainLinks]
  );
}
