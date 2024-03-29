import { useActiveAccountAddress } from '@recoil/activeAccount';
import { ApolloError, useApolloClient } from '@apollo/client';
import React from 'react';
import GetAccountRedelegations from 'services/graphql/queries/GetAccountRedelegations';
import { convertGraphQLRedelegation } from 'lib/GraphQLUtils';
import { Redelegation } from 'types/distribution';
import { safeParseInt } from 'lib/FormatUtils';
import { Coin } from '@desmoslabs/desmjs';
import { useCurrentChainInfo } from '@recoil/settings';
import { coin } from '@cosmjs/amino';

/**
 * Hook that provides the total amount of coins that a user
 * is currently redelegating.
 * @param userAddress - Address of the account for which the amount will be calculated.
 * If undefined, the address of the current active user will be used instead.
 */
const useTotalRedelegatingAmount = (userAddress?: string) => {
  const activeAccountAddress = useActiveAccountAddress();
  const address = userAddress ?? activeAccountAddress;
  const currentChainInfo = useCurrentChainInfo();
  const [totalAmount, setTotalamount] = React.useState<Coin>();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<ApolloError>();

  // Here we use useApolloClient instead of useLazyQuery
  // to force the returned callback to change when the client instance changes.
  const client = useApolloClient();

  const fetchAllRedelegations = React.useCallback(async () => {
    // Start loading
    setLoading(true);
    // Reset state.
    setError(undefined);
    setTotalamount(undefined);

    let completed = false;
    let offset = 0;
    let amount = 0;
    let fetchError: ApolloError | undefined;

    while (!completed && address !== undefined) {
      // eslint-disable-next-line no-await-in-loop
      const { data, error: apolloError } = await client.query({
        query: GetAccountRedelegations,
        // Use cache-and-network to avoid on-chain amounts sync issues.
        // This might happen if the user returns to a screen where this hook
        // has been used after doing a redelegation. In this case, the total
        // amount will be different from the amount on chain.
        fetchPolicy: 'cache-first',
        variables: {
          address,
          offset,
          limit: 100,
        },
      });

      if (apolloError || data === undefined) {
        fetchError = apolloError;
        completed = true;
      } else {
        const fetchedData = data.action_redelegation.redelegations as any[];
        amount = fetchedData
          .map(convertGraphQLRedelegation)
          .flatMap((redelegations: Redelegation[]) => redelegations)
          .reduce(
            (accumulator: number, redelegation: Redelegation) =>
              accumulator + safeParseInt(redelegation.balance),
            amount,
          );

        if (fetchedData.length < 100) {
          // We fetched a partial page, this means that the backend doesn't have
          // other elements, end the loop.
          completed = true;
        } else {
          // Fetched a full page, the backend my have an extra page, keep looping.
          offset += 100;
        }
      }
    }

    if (fetchError) {
      setError(fetchError);
    } else {
      setTotalamount(coin(amount, currentChainInfo.stakeCurrency.coinMinimalDenom));
    }

    setLoading(false);
  }, [client, address, currentChainInfo.stakeCurrency.coinMinimalDenom]);

  // Effect to trigger the data fetch logic.
  React.useEffect(() => {
    fetchAllRedelegations();
  }, [fetchAllRedelegations]);

  return {
    data: totalAmount,
    loading,
    error,
    refetch: fetchAllRedelegations,
  };
};

export default useTotalRedelegatingAmount;
