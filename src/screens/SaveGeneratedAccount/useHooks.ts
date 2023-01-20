import { useCallback, useMemo, useState } from 'react';
import { AccountWithWallet } from 'types/account';
import {
  deleteItem,
  deleteWallet,
  saveWallet,
  SecureStorageKeys,
  setUserPassword,
} from 'lib/SecureStorage';
import { useHasAccount, useStoreAccount } from '@recoil/accounts';

export const useSaveAccount = () => {
  const hasAccount = useHasAccount();
  const savingFirstAccount = useMemo(() => !hasAccount, [hasAccount]);

  const storeAccount = useStoreAccount();
  const [savingAccount, setSavingAccount] = useState(false);
  const [saveAccountError, setError] = useState<string>();

  const saveAccount = useCallback(
    async ({ account, wallet }: AccountWithWallet, password: string) => {
      try {
        setSavingAccount(true);
        setError(undefined);

        await saveWallet(wallet, password);
        if (savingFirstAccount) {
          await setUserPassword(password);
        }
        storeAccount(account);
      } catch (e) {
        // Remove possible saved data
        if (savingFirstAccount) {
          deleteItem(SecureStorageKeys.PASSWORD_CHALLENGE);
        }
        deleteWallet(wallet.address);
        setError(e.toString());
        throw e;
      } finally {
        setSavingAccount(false);
      }
    },
    [savingFirstAccount, storeAccount],
  );

  return {
    saveAccount,
    savingAccount,
    saveAccountError,
  };
};
