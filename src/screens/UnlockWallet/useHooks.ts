import { getWallet } from 'lib/SecureStorage';
import useConnectToLedger from 'hooks/useConnectToLedger';
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
import { err, ok, Result } from 'neverthrow';

/**
 * Hook that provides a function to initialize a mnemonic wallet.
 */
const useInitMnemonicWallet = () =>
  useCallback(
    async (
      serializedWallet: SerializableMnemonicWallet,
      signingMode?: SigningMode,
    ): Promise<Result<Wallet | undefined, Error>> => {
      const privateKey = fromHex(serializedWallet.privateKey);
      const hdPath = stringToPath(serializedWallet.hdPath);

      return ok({
        type: WalletType.Mnemonic,
        address: serializedWallet.address,
        privateKey,
        hdPath,
        addressPrefix: serializedWallet.addressPrefix,
        signer: PrivateKeySigner.fromSecp256k1(privateKey, signingMode ?? SigningMode.DIRECT, {
          prefix: serializedWallet.addressPrefix,
        }),
      } as MnemonicWallet);
    },
    [],
  );

/**
 * Hook that provides a function to initialize a Ledger wallet.
 */
const useInitLedgerWallet = () => {
  const connectToLedger = useConnectToLedger();

  return useCallback(
    async (
      serializedWallet: SerializableLedgerWallet,
    ): Promise<Result<Wallet | undefined, Error>> => {
      const ledgerApp = LedgerApps.find(({ name }) => name === serializedWallet.ledgerAppName);
      if (ledgerApp === undefined) {
        return err(new Error(`can't find app for wallet ${serializedWallet.address}`));
      }

      const transport = await connectToLedger(ledgerApp);
      if (transport === undefined) {
        return ok(undefined);
      }

      const hdPath = stringToPath(serializedWallet.hdPath);

      return ok({
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
      } as LedgerWallet);
    },
    [connectToLedger],
  );
};

/**
 * Hook that provides a function to initialize a Web3Auth wallet.
 */
const useInitWeb3AuthWallet = () =>
  useCallback(
    async (
      serializedWallet: SerializableWeb3AuthWallet,
      signingMode?: SigningMode,
    ): Promise<Result<Wallet | undefined, Error>> => {
      const privateKey = fromHex(serializedWallet.privateKey);

      return ok({
        type: WalletType.Web3Auth,
        address: serializedWallet.address,
        privateKey,
        addressPrefix: serializedWallet.addressPrefix,
        loginProvider: serializedWallet.loginProvider,
        signer: PrivateKeySigner.fromSecp256k1(privateKey, signingMode ?? SigningMode.DIRECT, {
          prefix: serializedWallet.addressPrefix,
        }),
      } as Web3AuthWallet);
    },
    [],
  );

/**
 * Hook that provides a function to unlock the wallet using the password.
 */
export const useUnlockWalletWithPassword = () => {
  const initMnemonicWallet = useInitMnemonicWallet();
  const initLedgerWallet = useInitLedgerWallet();
  const initWeb3AuthWallet = useInitWeb3AuthWallet();

  return useCallback(
    async (
      address: string,
      password: string,
      signingMode?: SigningMode,
    ): Promise<Result<Wallet | undefined, Error>> => {
      const result = await getWallet(address, password);
      if (result.isErr()) {
        return err(result.error);
      }

      switch (result.value.type) {
        case WalletType.Mnemonic: {
          return initMnemonicWallet(result.value, signingMode);
        }
        case WalletType.Ledger: {
          return initLedgerWallet(result.value);
        }
        case WalletType.Web3Auth: {
          return initWeb3AuthWallet(result.value, signingMode);
        }
        default:
          // It's impossible to reach this point, but TypeScript doesn't know that.
          // @ts-ignore
          return err(new Error(`unknown wallet type ${result.value.type}`));
      }
    },
    [initMnemonicWallet, initLedgerWallet, initWeb3AuthWallet],
  );
};
