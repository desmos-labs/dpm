import { ApolloClient, ApolloLink, createHttpLink, InMemoryCache } from '@apollo/client';
import { MultiAPILink } from '@habx/apollo-multi-endpoint-link';
import { DefaultEndpoints } from '@habx/apollo-multi-endpoint-link/dist/typings/interface';
import { useMemo } from 'react';

const gqlEndpoints = new Map<string, DefaultEndpoints>([
  [
    'testnet',
    {
      forbole: 'https://gql-morpheus.desmos.forbole.com',
      desmos: 'https://gql.morpheus.desmos.network',
    },
  ],
  [
    'desmos-mainnet',
    {
      forbole: 'https://gql.desmos.forbole.com',
      desmos: 'https://gql.mainnet.desmos.network',
    },
  ],
]);

export default function useApolloClient(chainId: string) {
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
    [endpoints]
  );
}
