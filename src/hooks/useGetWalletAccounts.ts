import {useCallback, useState} from 'react';
import {WalletGenerationData} from 'types/wallet';
import {AccountData} from '@cosmjs/amino';
import {HdPath} from '@cosmjs/crypto';

/**
 * Hook that allows to get the accounts connected to a Wallet based on the given generation data and master HD path.
 * @param data - Data that should be used to generate the wallet, except the HD paths.
 * @param options - Options to generate the Wallet accounts.
 */
const useGetWalletAccounts = (data: WalletGenerationData, options?: {masterPath?: HdPath}) => {
  const masterPath = options?.masterPath;
  const [loading, setLoading] = useState<boolean>(false);
  const [wallet] = useState<any>();
  const [accounts] = useState<readonly AccountData[]>([]);
  const [error, setError] = useState<string | undefined>(undefined);

  const getAccounts = useCallback(async (offset: number, limit: number) => {
    setLoading(true);

    let _hdPaths: HdPath[] | undefined;
    if (masterPath) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _hdPaths = [Array(limit - offset).keys()].map((_, index) => {
        // Only change the account index of the original HD path
        return [masterPath[0], masterPath[1], index, masterPath[3], masterPath[4]] as HdPath;
      });
    }

    try {

    } catch (e) {
      setError(e.toString());
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    getAccounts,
    loading,
    wallet,
    accounts,
    error,
  };
};

export default useGetWalletAccounts;
