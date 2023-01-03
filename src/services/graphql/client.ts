import {ApolloClient, ApolloLink, createHttpLink, InMemoryCache, NormalizedCacheObject} from '@apollo/client';
import { MultiAPILink } from '@habx/apollo-multi-endpoint-link';
import { DefaultEndpoints } from '@habx/apollo-multi-endpoint-link/dist/typings/interface';
import {WebSocketLink} from '@apollo/client/link/ws';
import {useRecoilState} from 'recoil';
import appSettingsState from '@recoil/settings';
import { AppSettings, ChainId } from 'types/settings';
import React, {useState} from 'react';

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

const multiApiLink = (chainId: ChainId) => {
  const endpoints = gqlEndpoints.get(chainId);
  if (!endpoints) {
    throw Error(`Undefined endpoints for chain id ${chainId}`);
  }

  return ApolloLink.from([
    new MultiAPILink({
      endpoints,
      httpSuffix: '/v1/graphql',
      wsSuffix: '/v1/graphql',
      createHttpLink,
      createWsLink: uri =>
        new WebSocketLink({
          uri,
          options: {
            reconnect: true,
          },
        }),
    }),
  ]);
};

const buildGraphQlClient = (chainId: ChainId) => new ApolloClient({
  cache: new InMemoryCache(),
  link: multiApiLink(chainId),
});

const useGraphQLClient = () => {
  const [settings] = useRecoilState<AppSettings>(appSettingsState);
  const {chainId} = settings;

  const defaultClient = buildGraphQlClient('testnet');
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>>(defaultClient);

  React.useEffect(() => {
    const graphQLClient = buildGraphQlClient(chainId);
    setClient(graphQLClient);
  }, [chainId]);

  return client;
};

export default useGraphQLClient;
