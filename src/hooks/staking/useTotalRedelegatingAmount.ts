import { useActiveAccountAddress } from '@recoil/activeAccount';
import { ApolloError, useLazyQuery } from '@apollo/client';
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

  if (address === undefined) {
    throw new Error("can't get staked amount without an active account or a provided address");
  }

  const [fetchRedelegations] = useLazyQuery(GetAccountRedelegations, {
    fetchPolicy: 'cache-and-network',
  });

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

    while (!completed) {
      // eslint-disable-next-line no-await-in-loop
      const { data, error: apolloError } = await fetchRedelegations({
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
  }, [address, currentChainInfo.stakeCurrency.coinMinimalDenom, fetchRedelegations]);

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
