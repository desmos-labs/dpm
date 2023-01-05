import { useCallback } from 'react';
import useAppContext from 'contexts/AppContext';

export default function useRemoveChainLink(address: string) {
  const { setChainLinks } = useAppContext();

  return useCallback(
    (toRemove: { externalAddress: string; chainName: string }) => {
      setChainLinks((old) => {
        const currentLinks = old[address] ?? [];
        const index = currentLinks.findIndex(
          (link) =>
            link.externalAddress === toRemove.externalAddress &&
            link.chainName === toRemove.chainLinkName,
        );
        if (index >= 0) {
          currentLinks.splice(index, 1);
          const newState = {
            ...old,
          };
          newState[address] = [...currentLinks];
          return newState;
        }
        return old;
      });
    },
    [address, setChainLinks],
  );
}
