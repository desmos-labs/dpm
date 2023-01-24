import { useEffect, useState } from 'react';
import { DesmosProfile } from 'types/desmos';
import { useLazyQuery } from '@apollo/client';
import GetProfileForAddress from 'services/graphql/queries/GetProfileForAddress';

export const useFetchProfile = (address: string, fetchDelay: number) => {
  const [profileLoading, setProfileLoading] = useState(false);
  const [profile, setProfile] = useState<DesmosProfile>();
  const [lazyFetchProfile] = useLazyQuery(GetProfileForAddress, {
    variables: { address: '' },
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    setProfileLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const { data } = await lazyFetchProfile({
          variables: { address },
        });
        setProfile(data.profile[0]);
      } finally {
        setProfileLoading(false);
      }
    }, fetchDelay);
    return () => {
      clearTimeout(timeout);
      setProfile(undefined);
    };
  }, [lazyFetchProfile, address, fetchDelay]);

  return {
    profile,
    profileLoading,
  };
};
