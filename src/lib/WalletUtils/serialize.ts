import {
  LedgerWallet,
  MnemonicWallet,
  SerializableLedgerWallet,
  SerializableMnemonicWallet, SerializableWallet, SerializableWeb3AuthWallet, Wallet, WalletSerializationVersion,
  WalletType, Web3AuthWallet,
} from 'types/wallet';
import { toHex } from '@cosmjs/encoding';
import { pathToString } from '@cosmjs/crypto';

/**
 * Convert a [MnemonicWallet] into a [SerializableMnemonicWallet]
 * @param wallet - The [MnemonicWallet] to convert.
 */
export const serializeMnemonicWallet = (wallet: MnemonicWallet): SerializableMnemonicWallet => {
  return {
    version: WalletSerializationVersion.Mnemonic,
    type: WalletType.Mnemonic,
    address: wallet.address,
    hdPath: pathToString(wallet.hdPath),
    privateKey: toHex(wallet.privateKey),
  };
};

/**
 * Convert a [LedgerWallet] into a [SerializableLedgerWallet]
 * @param wallet - The [LedgerWallet] to convert.
 */
export const serializeLedgerWallet = (wallet: LedgerWallet): SerializableLedgerWallet => {
  return {
    version: WalletSerializationVersion.Ledger,
    type: WalletType.Ledger,
    address: wallet.address,
    hdPath: pathToString(wallet.hdPath),
  };
};

/**
 * Convert a [Web3AuthWallet] into a [SerializableWeb3AuthWallet]
 * @param wallet - The [Web3AuthWallet] to convert.
 */
export const serializeWeb3AuthWallet = (wallet: Web3AuthWallet): SerializableWeb3AuthWallet => {
  return {
    version: WalletSerializationVersion.Web3Auth,
    type: WalletType.Web3Auth,
    address: wallet.address,
    privateKey: toHex(wallet.privateKey),
    loginProvider: wallet.loginProvider,
  };
};

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
