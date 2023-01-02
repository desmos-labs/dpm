import { ApolloClient, ApolloLink, createHttpLink, InMemoryCache } from '@apollo/client';
import { MultiAPILink } from '@habx/apollo-multi-endpoint-link';
import { DefaultEndpoints } from '@habx/apollo-multi-endpoint-link/dist/typings/interface';
import {DesmosMainnet, DesmosTestnet} from '@desmoslabs/desmjs';
import {WebSocketLink} from '@apollo/client/link/ws';

const gqlEndpoints = new Map<string, DefaultEndpoints>([
  [
    DesmosTestnet.chainName,
    {
      forbole: 'https://gql-morpheus.desmos.forbole.com',
      desmos: 'https://gql.morpheus.desmos.network',
    },
  ],
  [
    DesmosMainnet.chainName,
    {
      forbole: 'https://gql.desmos.forbole.com',
      desmos: 'https://gql.mainnet.desmos.network',
    },
  ],
]);


const multiApiLink = (chainName: string) => {
  const endpoints = gqlEndpoints.get(chainName);
  if (!endpoints) {
    throw Error(`Undefined endpoints for chain id ${chainName}`);
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

const buildGraphQlClient = (chainName: string) => new ApolloClient({
  cache: new InMemoryCache(),
  link: multiApiLink(chainName),
});

export default buildGraphQlClient;
