import { useCallback, useEffect, useState } from 'react';
import { useApolloClient } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { GetProfileModuleParams, GetProfileModuleParamsDocument } from '../graphql/types';

export default function useProfileValidators() {
  const client = useApolloClient();
  const { t } = useTranslation();
  const [dtagValidationParams, setDtagValidationParams] = useState({
    regEx: /^[A-Za-z0-9_]+$/,
    maxLength: 30,
    minLength: 3,
  });

  const [bioValidationParams, setBioValidationParams] = useState({
    maxLength: 1000,
  });

  const [nicknameValidationParams, setNicknameValidationParams] = useState({
    minLength: 2,
    maxLength: 1000,
  });

  useEffect(() => {
    (async () => {
      try {
        const result = await client.query<GetProfileModuleParams>({
          query: GetProfileModuleParamsDocument,
        });
        const { params } = result.data.profiles_params[0];
        setDtagValidationParams({
          regEx: new RegExp(params.dtag.reg_ex),
          minLength: parseInt(params.dtag.min_length, 10),
          maxLength: parseInt(params.dtag.max_length, 10),
        });
        setBioValidationParams({
          maxLength: parseInt(params.bio.max_length, 10),
        });
        setNicknameValidationParams({
          minLength: parseInt(params.nickname.min_length, 10),
          maxLength: parseInt(params.nickname.max_length, 10),
        });
      } catch (e) {
        console.error('Error when fetching profile params', e);
      }
    })();
  }, [client]);

  const validateDtag = useCallback(
    (dtag: string) => {
      const { minLength, maxLength, regEx } = dtagValidationParams;
      if (dtag.length < minLength) {
        return t('min field length', {
          field: 'dtag',
          min: minLength,
        });
      }
      if (dtag.length > maxLength) {
        return t('max field length', {
          field: 'dtag',
          max: maxLength,
        });
      }
      if (!dtag.match(regEx)) {
        return t('field regex', {
          field: 'dtag',
          regex: regEx.source,
        });
      }
      return undefined;
    },
    [dtagValidationParams, t]
  );

  const validateBio = useCallback(
    (bio: string) => {
      const { maxLength } = bioValidationParams;
      if (bio.length > maxLength) {
        return t('max field length', {
          field: 'bio',
          max: maxLength,
        });
      }
      return undefined;
    },
    [bioValidationParams, t]
  );

  const validateNickname = useCallback(
    (nickname: string) => {
      const { minLength, maxLength } = nicknameValidationParams;
      if (nickname.length < minLength) {
        return t('min field length', {
          field: 'nickname',
          min: minLength,
        });
      }
      if (nickname.length > maxLength) {
        return t('max field length', {
          field: 'nickname',
          max: maxLength,
        });
      }
      return undefined;
    },
    [nicknameValidationParams, t]
  );

  return {
    dtagValidationParams,
    validateDtag,
    nicknameValidationParams,
    validateNickname,
    bioValidationParams,
    validateBio,
  };
}
