import useChainLinksGivenAddress from 'hooks/useChainLinksGivenAddress';

const useQueries = (address: string | undefined) => {
  const {
    chainLinks,
    refetch: refetchChainLinks,
    loading: loadingChainLinks,
  } = useChainLinksGivenAddress(address);

  return {
    chainLinks,
    refetchChainLinks,
    loadingChainLinks,
  };
};

export default useQueries;
