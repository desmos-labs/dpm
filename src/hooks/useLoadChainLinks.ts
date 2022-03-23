import { useCallback } from 'react';
import { ChainLink } from '../types/link';
import { useAppContext } from '../contexts/AppContext';

/**
 * Hooks that provide a function to load all the chain links of
 * a list of addresses.
 */
export default function useLoadAllChainLinks(): (
  addresses: string[]
) => Promise<Record<string, ChainLink[]>> {
  const { setChainLinks } = useAppContext();
  return useCallback(
    async (_: string[]) => {
      // TODO: Implement a cache logic
      const result: Record<string, ChainLink[]> = {};
      setChainLinks(result);
      return result;
    },
    [setChainLinks]
  );
}
