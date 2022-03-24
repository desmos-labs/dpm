import { ApolloClient, InMemoryCache } from '@apollo/client';
import { useMemo } from 'react';

export default function useApolloClient(chainId: string) {
  return useMemo(() => {
    const hostname =
      chainId === 'morpheus-apollo-2'
        ? 'gql.morpheus.desmos.network'
        : 'gql.mainnet.desmos.network';
    return new ApolloClient({
      uri: `https://${hostname}/v1/graphql`,
      cache: new InMemoryCache(),
    });
  }, [chainId]);
}
