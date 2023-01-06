import { getWallet } from 'lib/SecureStorage';
import { useConnectToLedger } from 'hooks/useConnectToLedger';
import {
  LedgerWallet,
  MnemonicWallet,
  SerializableLedgerWallet,
  SerializableMnemonicWallet,
  SerializableWeb3AuthWallet,
  Wallet,
  WalletType,
  Web3AuthWallet,
} from 'types/wallet';
import { useCallback } from 'react';
import { fromHex } from '@cosmjs/encoding';
import { stringToPath } from '@cosmjs/crypto';
import { OfflineSignerAdapter, PrivateKeySigner, SigningMode } from '@desmoslabs/desmjs';
import { LedgerApps } from 'config/LedgerApps';
import { LedgerSigner } from '@cosmjs/ledger-amino';

/**
 * Hook that provides a function to initialize a mnemonic wallet.
 */
const useInitMnemonicWallet = () => {
  const initMnemonicWallet = useCallback(
    async (serializedWallet: SerializableMnemonicWallet): Promise<MnemonicWallet> => {
      const privateKey = fromHex(serializedWallet.privateKey);
      const hdPath = stringToPath(serializedWallet.hdPath);

      return {
        type: WalletType.Mnemonic,
        address: serializedWallet.address,
        privateKey,
        hdPath,
        addressPrefix: serializedWallet.addressPrefix,
        signer: PrivateKeySigner.fromSecp256k1(privateKey, SigningMode.DIRECT, {
          prefix: serializedWallet.addressPrefix,
        }),
      };
    },
    [],
  );

  return {
    initMnemonicWallet,
  };
};

/**
 * Hook that provides a function to initialize a Ledger wallet.
 */
const useInitLedgerWallet = () => {
  const { connectToLedger } = useConnectToLedger();

  const initLedgerWallet = useCallback(
    async (serializedWallet: SerializableLedgerWallet): Promise<LedgerWallet | undefined> => {
      const ledgerApp = LedgerApps.find(({ name }) => name === serializedWallet.ledgerAppName);
      if (ledgerApp === undefined) {
        throw new Error(`can't find app for wallet ${serializedWallet.address}`);
      }

      const transport = await connectToLedger(ledgerApp);
      if (transport === undefined) {
        return undefined;
      }

      const hdPath = stringToPath(serializedWallet.hdPath);

      return {
        type: WalletType.Ledger,
        address: serializedWallet.address,
        ledgerAppName: serializedWallet.ledgerAppName,
        hdPath,
        addressPrefix: serializedWallet.addressPrefix,
        signer: new OfflineSignerAdapter(
          new LedgerSigner(transport, {
            prefix: serializedWallet.addressPrefix,
            ledgerAppName: ledgerApp.name,
            minLedgerAppVersion: ledgerApp.minVersion,
            hdPaths: [hdPath],
          }),
        ),
      };
    },
    [connectToLedger],
  );

  return {
    initLedgerWallet,
  };
};

/**
 * Hook that provides a function to initialize a Web3Auth wallet.
 */
const useInitWeb3AuthWallet = () => {
  const initWeb3AuthWallet = useCallback(
    async (serializedWallet: SerializableWeb3AuthWallet): Promise<Web3AuthWallet> => {
      const privateKey = fromHex(serializedWallet.privateKey);

      return {
        type: WalletType.Web3Auth,
        address: serializedWallet.address,
        privateKey,
        addressPrefix: serializedWallet.addressPrefix,
        loginProvider: serializedWallet.loginProvider,
        signer: PrivateKeySigner.fromSecp256k1(privateKey, SigningMode.DIRECT, {
          prefix: serializedWallet.addressPrefix,
        }),
      };
    },
    [],
  );

  return {
    initWeb3AuthWallet,
  };
};

/**
 * Hook that provides a function to unlock the wallet using the password.
 */
export const useUnlockWalletWithPassword = () => {
  const { initMnemonicWallet } = useInitMnemonicWallet();
  const { initLedgerWallet } = useInitLedgerWallet();
  const { initWeb3AuthWallet } = useInitWeb3AuthWallet();

  return useCallback(
    async (address: string, password: string): Promise<Wallet | undefined> => {
      const serializedWallet = await getWallet(address, password);

      switch (serializedWallet.type) {
        case WalletType.Mnemonic:
          return initMnemonicWallet(serializedWallet);
        case WalletType.Ledger:
          return initLedgerWallet(serializedWallet);
        case WalletType.Web3Auth:
          return initWeb3AuthWallet(serializedWallet);
        default:
          // @ts-ignore
          throw new Error(`unsupported wallet type ${serializedWallet.type}`);
      }
    },
    [initMnemonicWallet, initLedgerWallet, initWeb3AuthWallet],
  );
};
