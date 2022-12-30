import { useState } from 'react';
import { ChainLink } from 'types/link';
import { useGetChainLinkByAddress } from 'graphql/types';

function useFetchChainLink(address: string) {
  const [loading, setLoading] = useState(true);
  const [chainLinks, setChainLinks] = useState<ChainLink[]>([]);
  const [error, setError] = useState<string | null>(null);

  useGetChainLinkByAddress({
    pollInterval: 500,
    variables: {
      address,
    },
    onCompleted: ({ chain_link }) => {
      const cLinks = chain_link.map(
        (link) =>
          ({
            chainName: link.chain_config.name,
            externalAddress: link.external_address,
            userAddress: link.user_address,
            creationTime: new Date(`${link.creation_time}Z`),
          } as ChainLink),
      );
      setChainLinks(cLinks);
      setError(null);
      setLoading(false);
    },
    onError: (apolloError) => {
      console.error(apolloError);
      setChainLinks([]);
      setError(apolloError.toString());
      setLoading(false);
    },
  });

  return {
    loading,
    chainLinks,
    error,
  };
}

export default useFetchChainLink;
