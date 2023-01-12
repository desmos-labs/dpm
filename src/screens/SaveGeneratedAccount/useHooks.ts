import { useCallback, useState } from 'react';
import { AccountWithWallet } from 'types/account';
import {
  deleteItem,
  deleteWallet,
  saveWallet,
  SECURE_STORAGE_KEYS,
  setUserPassword,
} from 'lib/SecureStorage';
import { useGetAccounts, useStoreAccount } from '@recoil/accounts';

export const useSaveAccount = () => {
  const accounts = useGetAccounts();
  const storeAccount = useStoreAccount();
  const [savingAccount, setSavingAccount] = useState(false);
  const [saveAccountError, setError] = useState<string>();

  const saveAccount = useCallback(
    async ({ account, wallet }: AccountWithWallet, password: string) => {
      const savingFirstAccount = Object.keys(accounts).length === 0;
      try {
        setSavingAccount(true);
        setError(undefined);

        await saveWallet(wallet, password);
        if (savingFirstAccount) {
          await setUserPassword(password);
        }
        storeAccount(account);
      } catch (e) {
        console.error(e);

        // Remove possible saved data
        if (savingFirstAccount) {
          deleteItem(SECURE_STORAGE_KEYS.PASSWORD_CHALLENGE);
        }
        deleteWallet(wallet.address);

        setError(e.toString());
        throw e;
      } finally {
        setSavingAccount(false);
      }
    },
    [accounts, storeAccount],
  );

  return {
    saveAccount,
    savingAccount,
    saveAccountError,
  };
};
