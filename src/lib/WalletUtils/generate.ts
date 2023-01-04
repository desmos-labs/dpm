import {
  LedgerWallet,
  MnemonicWallet,
  Wallet,
  WalletGenerationData,
  WalletType,
  Web3AuthWallet,
} from 'types/wallet';
import { OfflineSignerAdapter, PrivateKeySigner, SigningMode } from '@desmoslabs/desmjs';
import { HdPath } from '@cosmjs/crypto';
import BluetoothTransport from '@ledgerhq/react-native-hw-transport-ble';
import { LedgerSigner } from '@cosmjs/ledger-amino';
import { CryptoUtils } from 'native/CryptoUtils';
import { LedgerApp } from 'types/ledger';
import { slip10IndexToBaseNumber } from 'lib/FormatUtils';

/**
 * Function allowing to generate a list of [LedgerWallet].
 * @param prefix - Account prefix that should be used to generate the Bech32 address of the wallet.
 * @param hdPaths - HD paths that should be used to generate the wallet. If more than one is specified,
 * the getAccounts() method will return all the information for each account.
 * @param app - Ledger app that should be used to sign the transactions.
 * @param transport - Bluetooth Transport that should be used to connect to the Ledger device.
 */
export const generateLedgerWallets = async (
  prefix: string,
  hdPaths: HdPath[],
  app: LedgerApp,
  transport: BluetoothTransport,
): Promise<LedgerWallet[]> => {
  const signer = new OfflineSignerAdapter(
    new LedgerSigner(transport!, {
      minLedgerAppVersion: app.minVersion,
      ledgerAppName: app.name,
      prefix,
      hdPaths,
    }),
  );

  await signer.connect();
  const accounts = await signer.getAccounts();

  return accounts.map((account, i) => ({
    type: WalletType.Ledger,
    address: account.address,
    signer,
    hdPath: hdPaths[i],
  }));
};

/**
 * Function allowing to generate a list of MnemonicWallet.
 * @param prefix - Account prefix that should be used to generate the Bech32 address of the wallet.
 * @param hdPaths - HD paths that should be used to generate the wallet. If more than one is specified,
 * the getAccounts() method will return all the information for each account.
 * @param mnemonic - Mnemonic from which to generate the wallet.
 */
export const generateMnemonicWallets = async (
  prefix: string,
  hdPaths: HdPath[],
  mnemonic: string,
): Promise<MnemonicWallet[]> => {
  return Promise.all(
    hdPaths.map(async (hdPath) => {
      const [, coinType, account, change, index] = hdPath;
      const { privkey } = await CryptoUtils.deriveKeyPairFromMnemonic(
        mnemonic,
        slip10IndexToBaseNumber(coinType),
        slip10IndexToBaseNumber(account),
        slip10IndexToBaseNumber(change),
        slip10IndexToBaseNumber(index),
      );
      const signer = PrivateKeySigner.fromSecp256k1(privkey, SigningMode.DIRECT, {
        prefix,
      });
      await signer.connect();

      const [accountData] = await signer.getAccounts();

      return {
        type: WalletType.Mnemonic,
        signer,
        address: accountData.address,
        hdPath,
        privateKey: signer.privateKey.key,
      } as MnemonicWallet;
    }),
  );
};

/**
 * Function allowing to generate a Web3AuthWallet.
 * @param prefix - Account prefix that should be used to generate the Bech32 address of the wallet.
 * @param loginProvider - Login provided used from the user to obtain the private key.
 * @param privateKey - The private key obtained from Web3Auth.
 */
export const generateWeb3AuthWallet = async (
  prefix: string,
  loginProvider: string,
  privateKey: Uint8Array,
): Promise<Web3AuthWallet> => {
  const signer = await PrivateKeySigner.fromSecp256k1(privateKey, SigningMode.DIRECT, {
    prefix,
  });

  await signer.connect();
  const [accountData] = await signer.getAccounts();

  return {
    type: WalletType.Web3Auth,
    address: accountData.address,
    signer,
    loginProvider,
    privateKey,
  };
};

/**
 * Function allowing to generate a list of Wallet.
 * @param data - Wallet generation config.
 */
export const generateWallets = async (data: WalletGenerationData): Promise<Wallet[]> => {
  switch (data.type) {
    case WalletType.Ledger:
      if (data.hdPaths.length === 0) {
        throw new Error('At least one HD path needs to be specified');
      }
      return generateLedgerWallets(data.accountPrefix, data.hdPaths, data.app, data.transport);

    case WalletType.Mnemonic:
      if (data.hdPaths.length === 0) {
        throw new Error('At least one HD path needs to be specified');
      }
      return generateMnemonicWallets(data.accountPrefix, data.hdPaths, data.mnemonic);

    case WalletType.Web3Auth: {
      const wallet = await generateWeb3AuthWallet(
        data.accountPrefix,
        data.loginProvider,
        data.privateKey,
      );
      return [wallet];
    }

    default:
      // @ts-ignore
      throw new Error(`Cannot generate wallet from HD path for import type ${data.type}`);
  }
};
