import { ApolloError, useApolloClient } from '@apollo/client';
import { err, ok, Result } from 'neverthrow';
import React from 'react';
import GetAccountBalance from 'services/graphql/queries/GetAccountBalance';
import { Coin } from '@desmoslabs/desmjs-types/cosmos/base/v1beta1/coin';

/**
 * Hook that provides a function to get the balance of an account from
 * its address.
 */
const useGetBalance = () => {
  const apolloClient = useApolloClient();

  return React.useCallback(
    async (address: string): Promise<Result<Coin[], ApolloError>> => {
      const { data, error } = await apolloClient.query({
        query: GetAccountBalance,
        variables: {
          address,
        },
      });

      if (error) {
        return err(error);
      }

      const coins: Coin[] = data?.accountBalance?.coins ?? [];
      return ok(coins);
    },
    [apolloClient],
  );
};

export default useGetBalance;
