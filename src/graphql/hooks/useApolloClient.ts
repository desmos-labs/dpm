import { ApolloClient, ApolloLink, createHttpLink, InMemoryCache } from '@apollo/client';
import { MultiAPILink } from '@habx/apollo-multi-endpoint-link';
import { DefaultEndpoints } from '@habx/apollo-multi-endpoint-link/dist/typings/interface';
import { useMemo } from 'react';
import { ChainId } from 'types/chain';

const gqlEndpoints = new Map<ChainId, DefaultEndpoints>([
  [
    'testnet',
    {
      forbole: 'https://gql-morpheus.desmos.forbole.com',
      desmos: 'https://gql.morpheus.desmos.network',
    },
  ],
  [
    'mainnet',
    {
      forbole: 'https://gql.desmos.forbole.com',
      desmos: 'https://gql.mainnet.desmos.network',
    },
  ],
]);

export default function useApolloClient(chainId: ChainId) {
  const endpoints = gqlEndpoints.get(chainId);
  if (!endpoints) {
    throw Error(`Undefined endpoints for chain id ${chainId}`);
  }

  return useMemo(
    () =>
      new ApolloClient({
        cache: new InMemoryCache(),
        link: ApolloLink.from([
          new MultiAPILink({
            endpoints,
            httpSuffix: '/v1/graphql',
            createHttpLink,
          }),
        ]),
      }),
    [endpoints],
  );
}
