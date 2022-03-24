import { useCallback } from 'react';
import { useAppContext } from '../contexts/AppContext';
import AccountSource from '../sources/AccountSource';
import ProfileSource from '../sources/ProfileSource';
import { ChainAccount } from '../types/chain';

export default function useDeleteAccount(): (toDelete: ChainAccount) => Promise<ChainAccount[]> {
  const { accounts, setAccounts, setProfiles } = useAppContext();

  return useCallback(
    async (toDelete: ChainAccount) => {
      const newAccounts = accounts.filter((a) => a.address !== toDelete.address);
      setProfiles((old) => {
        if (old[toDelete.address] !== undefined) {
          const newProfiles = { ...old };
          delete newProfiles[toDelete.address];
          return newProfiles;
        }
        return old;
      });
      setAccounts(newAccounts);
      await ProfileSource.deleteProfile(toDelete.address);
      await AccountSource.removeAccount(toDelete);
      return newAccounts;
    },
    [accounts, setAccounts, setProfiles]
  );
}
