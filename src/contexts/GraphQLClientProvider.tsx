import { ApolloProvider } from '@apollo/client';
import React from 'react';
import buildGraphQlClient from 'services/graphql/client';

const GraphQLClientProvider: React.FC = ({ children }) => {
  const client = buildGraphQlClient();
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default GraphQLClientProvider;
