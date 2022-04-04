import { useCallback, useState } from 'react';
import { AirdropApi } from '../api/AirdropApi';
import { ChainLink } from '../types/link';
import useChainLinks from './useChainLinks';

export default function useCheckPendingRewards(desmosAddress: string) {
  const [loading, setLoading] = useState(true);
  const [available, setAvailable] = useState(false);
  const [toBeClaimed, setToBeClaimed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const chainLinks = useChainLinks(desmosAddress);

  const awaitForFetching = async (link: ChainLink) =>
    AirdropApi.fetchAllottedDsm(link.externalAddress);

  const updatePendingRewards = useCallback(async () => {
    setLoading(true);
    setError(null);
    setAvailable(false);
    const total = 0;
    // FIXME

    /*    chainLinks.forEach(link => {
      const linkChainName = link.chainName === 'cro' ? 'crypto.com' : link.chainName.toLowerCase();
      const allocationsToBeClaimed = allocations.allocations.filter(
        (allocation) => !allocation.claimed && allocation.chainName.toLowerCase() === linkChainName
      );
      total = allocationsToBeClaimed.reduce(
        (previousValue, currentValue) => previousValue + currentValue.amount,
        total
      );
    }) */
    setAvailable(total > 0);
    setToBeClaimed(total);
    setLoading(false);
  }, [chainLinks]);

  return {
    updatePendingRewards,
    loading,
    available,
    toBeClaimed,
    error,
  };
}
