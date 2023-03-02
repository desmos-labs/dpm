import { useLazyQuery } from '@apollo/client';
import GetValidatorInfo from 'services/graphql/queries/GetValidatorInfo';
import GetProfileForAddress from 'services/graphql/queries/GetProfileForAddress';
import React from 'react';
import { convertGraphQLProfile } from 'lib/GraphQLUtils';
import { DesmosProfile } from 'types/desmos';

/**
 * Hook that provides the Profile of a validator.
 * @param operatorAddress - The validator operator address.
 * @param lazy - Tell the hook to lazy load the data.
 */
const useValidatorProfile = (operatorAddress: string, lazy?: boolean) => {
  const [
    getValidatorInfo,
    { data: validatorInfoData, loading: loadingValidatorInfo, error: validationInfoError },
  ] = useLazyQuery(GetValidatorInfo);
  const [
    getDesmosProfile,
    { data: validatorProfileData, loading: loadingValidatorProfile, error: validatorProfileError },
  ] = useLazyQuery(GetProfileForAddress);

  const fetchValidatorProfile = React.useCallback(
    async (abortController?: AbortController) => {
      const { data: validatorData } = await getValidatorInfo({
        variables: {
          operatorAddress,
        },
        context: {
          fetchOptions: {
            signal: abortController?.signal,
          },
        },
      });

      const [validator] = validatorData.validator;
      // Extract the data from server response.
      const validatorSelfDelegate = validator.validator_info.self_delegate_address;

      // Fetch the profile associated to the validator self delegate address.
      await getDesmosProfile({
        variables: {
          address: validatorSelfDelegate,
        },
        context: {
          fetchOptions: {
            signal: abortController?.signal,
          },
        },
      });
    },
    [getDesmosProfile, getValidatorInfo, operatorAddress],
  );

  const profile = React.useMemo(() => {
    if (
      loadingValidatorInfo ||
      loadingValidatorProfile ||
      validatorInfoData === undefined ||
      validatorProfileData === undefined
    ) {
      return undefined;
    }

    const [validator] = validatorInfoData.validator;

    // Extract the data from server response.
    const validatorInfo = validator.validator_info;
    const [validatorDescription] = validator.validator_descriptions;

    const validatorProfile = convertGraphQLProfile(validatorProfileData.profile[0]);
    if (validatorProfile !== undefined) {
      return validatorProfile;
    }

    // The validator don't have a profile, so let's create a fake one using the
    // validator's info.
    return {
      address: validatorInfo.self_delegate_address,
      bio: validatorDescription.details,
      nickname: validatorDescription.moniker,
      profilePicture: validatorDescription.avatar_url,
    } as DesmosProfile;
  }, [loadingValidatorInfo, loadingValidatorProfile, validatorInfoData, validatorProfileData]);

  const loading = React.useMemo(
    () => loadingValidatorInfo || loadingValidatorProfile,
    [loadingValidatorInfo, loadingValidatorProfile],
  );

  const error = React.useMemo(
    () => validationInfoError ?? validatorProfileError,
    [validationInfoError, validatorProfileError],
  );

  React.useEffect(() => {
    if (lazy !== true) {
      const abortController = new AbortController();
      fetchValidatorProfile(abortController);
      // Return a function to interrupt the query when the
      // components unmount.
      return () => abortController.abort();
    }

    return undefined;
  }, [lazy, fetchValidatorProfile]);

  return {
    profile,
    loading,
    error,
    refetch: fetchValidatorProfile,
  };
};

export default useValidatorProfile;
