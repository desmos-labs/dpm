import React from 'react';
import { ProfileParams } from 'types/desmosTypes';
import { atom, useRecoilState } from 'recoil';
import { getMMKV, MMKVKEYS, setMMKV } from 'lib/MMKVStorage';
import { useLazyQuery } from '@apollo/client';
import GetProfileModuleParams from 'services/graphql/queries/GetProfileModuleParams';

const DefaultProfilesParams = {
  dTag: {
    regEx: '^[A-Za-z0-9_]+$',
    minLength: 3,
    maxLength: 30,
  },
  nickname: {
    minLength: 2,
    maxLength: 1000,
  },
  bio: {
    maxLength: 1000,
  },
} as ProfileParams;

const profileParamsAppState = atom<ProfileParams>({
  key: 'profilesParams',
  default: (() => {
    const storedParams = getMMKV<ProfileParams>(MMKVKEYS.PROFILES_PARAMS);
    return storedParams || DefaultProfilesParams;
  })(),
  effects: [
    ({ onSet }) => {
      onSet((newParamsValue) => {
        setMMKV(MMKVKEYS.PROFILES_PARAMS, newParamsValue);
      });
    },
  ],
});

const convertParams = (params: any): ProfileParams =>
  ({
    dTag: {
      regEx: params.dtag.reg_ex,
      maxLength: params.dtag.max_length,
      minLength: params.dtag.min_length,
    },
    bio: {
      maxLength: params.bio.max_length,
    },
    nickname: {
      maxLength: params.nickname.max_length,
      minLength: params.nickname.min_length,
    },
  } as ProfileParams);

export const useProfileParams = () => {
  const [profileParams, setProfileParams] = useRecoilState(profileParamsAppState);

  const [, { loading, refetch }] = useLazyQuery(GetProfileModuleParams, {
    fetchPolicy: 'no-cache',
  });

  const fetchProfileParams = React.useCallback(async () => {
    const { data } = await refetch();
    if (!data) {
      return;
    }

    const { params } = data;
    const [onChainParams] = params;
    setProfileParams(convertParams(onChainParams.params));
  }, [refetch, setProfileParams]);

  return {
    params: profileParams,
    loading,
    refetch: fetchProfileParams,
  };
};
