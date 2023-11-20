import {
  LedgerWallet,
  MnemonicWallet,
  SerializableLedgerWallet,
  SerializableMnemonicWallet,
  SerializableWallet,
  SerializableWeb3AuthWallet,
  Wallet,
  WalletSerializationVersion,
  WalletType,
  Web3AuthWallet,
} from 'types/wallet';
import { toHex } from '@cosmjs/encoding';
import { pathToString } from '@cosmjs/crypto';

/**
 * Convert a [MnemonicWallet] into a [SerializableMnemonicWallet]
 * @param wallet - The [MnemonicWallet] to convert.
 */
const serializeMnemonicWallet = (wallet: MnemonicWallet): SerializableMnemonicWallet => ({
  version: WalletSerializationVersion.Mnemonic,
  type: WalletType.Mnemonic,
  address: wallet.address,
  addressPrefix: wallet.addressPrefix,
  hdPath: pathToString(wallet.hdPath),
  privateKey: toHex(wallet.privateKey),
});

/**
 * Convert a [LedgerWallet] into a [SerializableLedgerWallet]
 * @param wallet - The [LedgerWallet] to convert.
 */
const serializeLedgerWallet = (wallet: LedgerWallet): SerializableLedgerWallet => ({
  version: WalletSerializationVersion.Ledger,
  type: WalletType.Ledger,
  addressPrefix: wallet.addressPrefix,
  address: wallet.address,
  hdPath: pathToString(wallet.hdPath),
  ledgerAppName: wallet.ledgerAppName,
});

/**
 * Convert a [Web3AuthWallet] into a [SerializableWeb3AuthWallet]
 * @param wallet - The [Web3AuthWallet] to convert.
 */
const serializeWeb3AuthWallet = (wallet: Web3AuthWallet): SerializableWeb3AuthWallet => ({
  version: WalletSerializationVersion.Web3Auth,
  type: WalletType.Web3Auth,
  addressPrefix: wallet.addressPrefix,
  address: wallet.address,
  privateKey: toHex(wallet.privateKey),
  loginProvider: wallet.loginProvider,
});

/**
 * Convert a [Wallet] into a [SerializableWallet]
 * @param wallet - The [Wallet] to convert.
 */
export const serializeWallet = (wallet: Wallet): SerializableWallet => {
  let serializableWallet: SerializableWallet;

  switch (wallet.type) {
    case WalletType.Ledger:
      serializableWallet = serializeLedgerWallet(wallet);
      break;
    case WalletType.Mnemonic:
      serializableWallet = serializeMnemonicWallet(wallet);
      break;
    case WalletType.Web3Auth:
      serializableWallet = serializeWeb3AuthWallet(wallet);
      break;
    default:
      // @ts-ignore
      throw new Error(`can't serialize wallet with type ${wallet.type}`);
  }

  return serializableWallet;
};
