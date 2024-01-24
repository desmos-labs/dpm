import { ApolloProvider } from '@apollo/client';
import React, { PropsWithChildren } from 'react';
import useGraphQLClient from 'services/graphql/client';

const GraphQLClientProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const client = useGraphQLClient();
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default GraphQLClientProvider;
