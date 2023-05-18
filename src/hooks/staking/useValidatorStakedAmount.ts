import { useQuery } from '@apollo/client';
import React from 'react';
import { convertGraphQLDelegation } from 'lib/GraphQLUtils';
import { Delegation } from 'types/distribution';
import { useActiveAccountAddress } from '@recoil/activeAccount';
import GetAccountDelegations from 'services/graphql/queries/GetAccountDelegations';
import { coin } from '@cosmjs/amino';
import { useCurrentChainInfo } from '@recoil/settings';
import { Coin } from '@desmoslabs/desmjs-types/cosmos/base/v1beta1/coin';

/**
 * Hook that provides the amount of coins that a user delegated toward a validator.
 * @param validatorOperatorAddress - Validator whose delegations will be fetched.
 * @param accountAddress - Account that performed the delegations, if undefined
 * will be used the current active account address.
 */
const useValidatorStakedAmount = (validatorOperatorAddress: string, accountAddress?: string) => {
  const chainInfo = useCurrentChainInfo();
  const activeAccountAddress = useActiveAccountAddress();
  const address = accountAddress ?? activeAccountAddress;

  if (address === undefined) {
    throw new Error("Can't find the user delegations if the address is undefined");
  }

  const { data, loading, error } = useQuery(GetAccountDelegations, {
    fetchPolicy: 'network-only',
    variables: {
      address,
    },
  });

  const redelegations = React.useMemo<Coin[] | undefined>(() => {
    if (data === undefined) {
      return undefined;
    }

    const coins = data.action_delegation.delegations
      .map(convertGraphQLDelegation)
      .find((d: Delegation) => d.validatorAddress === validatorOperatorAddress)?.coins;

    return coins ?? [coin(0, chainInfo.stakeCurrency.coinMinimalDenom)];
  }, [chainInfo.stakeCurrency.coinMinimalDenom, data, validatorOperatorAddress]);

  return {
    data: redelegations,
    loading,
    error,
  };
};

export default useValidatorStakedAmount;
