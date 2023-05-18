import { ApolloError, useLazyQuery } from '@apollo/client';
import GetValidatorInfo from 'services/graphql/queries/GetValidatorInfo';
import React from 'react';
import { convertGraphQLValidator } from 'lib/GraphQLUtils';
import GetProfileForAddress from 'services/graphql/queries/GetProfileForAddress';
import { Validator } from 'types/validator';

/**
 * Hook that provides a function to fetch the validator info alongside its
 * Desmos profile.
 */
const useGetValidatorQuery = () => {
  const [getValidatorInfo] = useLazyQuery(GetValidatorInfo);
  const [getProfileForAddresses] = useLazyQuery(GetProfileForAddress);

  return React.useCallback(
    async (operatorAddress: string) => {
      const { data: validatorInfo, error: errorValidatorInfo } = await getValidatorInfo({
        variables: {
          operatorAddress,
        },
      });

      if (errorValidatorInfo) {
        return { data: undefined, error: errorValidatorInfo };
      }

      const { data: validatorProfile, error: validatorProfileError } = await getProfileForAddresses(
        {
          variables: {
            address: validatorInfo.validator[0].validator_info.self_delegate_address,
          },
        },
      );

      if (validatorProfileError !== undefined) {
        return { data: undefined, error: errorValidatorInfo };
      }

      const validator = convertGraphQLValidator(
        validatorInfo.validator[0],
        validatorProfile.profile[0],
      );

      return {
        data: validator,
        error: undefined,
      };
    },
    [getValidatorInfo, getProfileForAddresses],
  );
};

/**
 * Hook that provides a Validator struct given a validator operator address.
 * @param operatorAddress - Validator operator address.
 */
const useValidator = (operatorAddress: string) => {
  const getValidatorQuery = useGetValidatorQuery();
  const [validator, setValidator] = React.useState<Validator>();
  const [error, setError] = React.useState<ApolloError>();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      const queryResult = await getValidatorQuery(operatorAddress);
      setValidator(queryResult.data);
      setError(queryResult.error);
      setLoading(false);
    })();
  }, [getValidatorQuery, operatorAddress]);

  return {
    data: validator,
    error,
    loading,
  };
};

export default useValidator;
