import { usePostHog } from 'posthog-react-native';
import { useCallback } from 'react';
import * as Aes from 'react-native-aes-crypto';

const useIdentifyUser = () => {
  const postHog = usePostHog();

  return useCallback(
    async (accountsAddresses: string[]) => {
      if (!postHog) {
        return;
      }

      // We collect the addresses hash to prevent association
      // of addresses between users.
      const hashes = await Promise.all(accountsAddresses.map(Aes.sha256));
      const anonymousId = postHog.getAnonymousId();
      postHog.identify(anonymousId, {
        addresses: hashes,
      });
    },
    [postHog],
  );
};

export default useIdentifyUser;
