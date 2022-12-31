import {useCallback, useState} from 'react';
import {HdPath} from 'types/hdpath';
import {ImportMode} from 'types/navigation';
import {LinkableChain} from 'types/chain';
import {LedgerApp} from 'types/ledger';
import BluetoothTransport from '@ledgerhq/react-native-hw-transport-ble';
import useGenerateWalletFromHDPath from 'hooks/wallet/useGenerateWalletFromHDPath';
import {Wallet} from 'types/wallet';

const useFetchWallets = (importMode: ImportMode, chain: LinkableChain, hdPath: HdPath, options: {
  mnemonic?: string,
  ledgerApp?: LedgerApp,
  ledgerTransport?: BluetoothTransport,
}) => {
  const [fetchingWallets, setFetchingWallets ] = useState<boolean>(false);
  const [wallets, setWallets] = useState<Wallet[]>([]);

  const generateWalletFromHDPath = useGenerateWalletFromHDPath(importMode, chain, options);

  const fetchWallets = useCallback(async (offset:number, limit:number) => {
    setFetchingWallets(true);

    const generatedWallets = await Promise.all([Array(limit - offset).keys()].map(async (_, index) => {
      return generateWalletFromHDPath({
        coinType: hdPath.coinType,
        account: index,
        change: hdPath.change,
        addressIndex: hdPath.addressIndex,
      } as HdPath);
    }));

    const nonNullWallets = generatedWallets.filter((value) => value != null) as Wallet[];
    setWallets(nonNullWallets);
    setFetchingWallets(false);
    return wallets;
  }, []);

  return {
    fetchingWallets,
    fetchWallets,
  };
};

export default useFetchWallets;
