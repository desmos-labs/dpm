import { convertCoin } from '@desmoslabs/desmjs';
import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useRef } from 'react';
import useAppContext from 'contexts/AppContext';
import useDesmosClient from './desmosclient/useDesmosClient';
import useCurrentChainInfo from './desmosclient/useCurrentChainInfo';

/**
 * Hook to fetches an account balance.
 * @param address - Address of the account of interest.
 */
export default function useFetchUserBalance(address: string) {
  const chainInfo = useCurrentChainInfo();
  const { setSelectedAccountBalance } = useAppContext();

  const client = useDesmosClient();
  const navigation = useNavigation();
  const mountedRef = useRef<boolean>(false);

  const fetchBalance = useCallback(
    async (chainAddress: string) => {
      setSelectedAccountBalance({
        amount: '---',
        denom: '',
      });
      try {
        if (client !== undefined) {
          const chainBalance = await client.getBalance(chainAddress, chainInfo.stakeCurrency.coinDenom);
          const balance = convertCoin(chainBalance, 6, chainInfo.currencies);
          if (mountedRef.current) {
            if (balance !== null) {
              setSelectedAccountBalance(balance);
            } else {
              setSelectedAccountBalance(chainBalance);
            }
          }
        }
      } catch (e) {
        // Ignore network error and account not present
        // on the chain
      }
    },
    [client, chainInfo],
  );

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchBalance(address).then(() => {});
    });
    return () => {
      unsubscribe();
    };
  }, [fetchBalance, navigation, address]);

  useEffect(() => {
    fetchBalance(address).then(() => {});
  }, [address, fetchBalance]);

  return fetchBalance;
}
