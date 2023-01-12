import { ApolloProvider } from '@apollo/client';
import React from 'react';
import useGraphQLClient from 'services/graphql/client';

const GraphQLClientProvider: React.FC = ({ children }) => {
  const client = useGraphQLClient();
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default GraphQLClientProvider;
