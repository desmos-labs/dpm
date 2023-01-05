import { useCallback, useState } from 'react';
import { Account, AccountWithWallet } from 'types/account';
import { useRecoilState } from 'recoil';
import { accountsAppState } from '@recoil/accounts';
import {
  deleteItem,
  deleteWallet,
  savePasswordChallenge,
  saveWallet,
  SECURE_STORAGE_KEYS,
} from 'lib/SecureStorage';

export const useSaveAccount = () => {
  const [accounts, setAccounts] = useRecoilState(accountsAppState);
  const [savingAccount, setSavingAccount] = useState(false);
  const [saveAccountError, setError] = useState<string>();

  const saveAccount = useCallback(
    async ({ account, wallet }: AccountWithWallet, password: string) => {
      const savingFirstAccount = Object.keys(accounts).length === 0;
      try {
        setSavingAccount(true);
        setError(undefined);
        const operations: Promise<any>[] = [];
        // Save the wallet
        operations.push(saveWallet(wallet, password));
        if (savingFirstAccount) {
          operations.push(savePasswordChallenge(password));
        }
        // Update the accounts
        setAccounts((oldValue) => {
          const newValue: Record<string, Account> = {
            ...oldValue,
          };
          newValue[account.address] = account;
          return newValue;
        });
        await Promise.all(operations);
        setSavingAccount(false);
      } catch (e) {
        console.error(e);

        // Remove possible saved data
        if (savingFirstAccount) {
          deleteItem(SECURE_STORAGE_KEYS.PASSWORD_CHALLENGE);
        }
        deleteWallet(wallet.address);

        setSavingAccount(false);
        setError(e.toString());
        throw e;
      }
    },
    [setAccounts, accounts],
  );

  return {
    saveAccount,
    savingAccount,
    saveAccountError,
  };
};
