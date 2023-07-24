import useShowModal from 'hooks/useShowModal';
import { useHasAccount } from '@recoil/accounts';
import React from 'react';
import { containsData, SecureStorageKeys } from 'lib/SecureStorage';
import CorruptedKeychainModal from 'modals/CorruptedKeychainModal';

const useCheckKeyChainIntegrity = () => {
  const showModal = useShowModal();
  const hasAccount = useHasAccount();

  React.useEffect(() => {
    (async () => {
      if (hasAccount) {
        // Since the user have at least one account the password challenge
        // should exist in the secure storage.
        const passwordChallengeExists = await containsData(SecureStorageKeys.PASSWORD_CHALLENGE);
        if (!passwordChallengeExists) {
          // The password challenge don't exist, this means that the secure
          // storage is in an incorrect state, this can be caused
          // from the migration that we made from the Forbole Limited
          // organization to the Desmos Labs on the Apple Store.
          showModal(CorruptedKeychainModal, undefined, {
            blockGoBack: true,
          });
        }
      }
    })();
    // Safe to ignore we want to execute this hook just one time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

export default useCheckKeyChainIntegrity;
