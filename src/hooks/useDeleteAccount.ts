import { useCallback } from 'react';
import useAppContext from '../contexts/AppContext';
import AccountSource from '../sources/AccountSource';
import ProfileSourceSingleton from '../sources/ProfileSource';

export default function useDeleteAccount(): (toDelete: any) => Promise<any[]> {
  const { accounts, setAccounts, setProfiles } = useAppContext();

  return useCallback(
    async (toDelete: any) => {
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
      await ProfileSourceSingleton.deleteProfile(toDelete.address);
      await AccountSource.removeAccount(toDelete);
      return newAccounts;
    },
    [accounts, setAccounts, setProfiles],
  );
}
