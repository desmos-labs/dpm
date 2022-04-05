import { convertCoin } from '@desmoslabs/sdk-core';
import { useCurrentChainInfo, useDesmosClient } from '@desmoslabs/sdk-react';
import { useNavigation } from '@react-navigation/native';
import { Coin } from 'cosmjs-types/cosmos/base/v1beta1/coin';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAppContext } from '../contexts/AppContext';

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
        await client.connect();
        const chainBalance = await client.getBalance(chainAddress, chainInfo.coinDenom);
        const balance = convertCoin(chainBalance, 6, chainInfo.denomUnits);
        if (mountedRef.current) {
          if (balance !== null) {
            setSelectedAccountBalance(balance);
          } else {
            setSelectedAccountBalance(chainBalance);
          }
        }
      } catch (e) {
        // Ignore network error and account not present
        // on the chain
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [client, chainInfo]
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
