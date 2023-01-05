import { useCallback, useState } from 'react';
import { Account, AccountWithWallet } from 'types/account';
import { useRecoilState } from 'recoil';
import { accountsAppState } from '@recoil/accounts';
import { saveWallet } from 'lib/SecureStorage';

export const useSaveAccount = () => {
  const [, setAccounts] = useRecoilState(accountsAppState);
  const [savingAccount, setSavingAccount] = useState(false);
  const [saveAccountError, setError] = useState<string>();

  const saveAccount = useCallback(
    async ({ account, wallet }: AccountWithWallet, password: string) => {
      try {
        setSavingAccount(true);
        setError(undefined);
        // Save the wallet
        await saveWallet(wallet, password);
        // Update the accounts
        setAccounts((oldValue) => {
          const newValue: Record<string, Account> = {
            ...oldValue,
          };
          newValue[account.address] = account;
          return newValue;
        });
        setSavingAccount(false);
      } catch (e) {
        console.error(e);
        setSavingAccount(false);
        setError(e.toString());
        throw e;
      }
    },
    [setAccounts],
  );

  return {
    saveAccount,
    savingAccount,
    saveAccountError,
  };
};
