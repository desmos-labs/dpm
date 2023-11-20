import {
  SerializableLedgerWallet,
  SerializableMnemonicWallet,
  SerializableWallet,
  SerializableWeb3AuthWallet,
  WalletType,
} from 'types/wallet';
import { stringToPath } from '@cosmjs/crypto/build/slip10';

/**
 * Deserialize a [SerializableMnemonicWallet] from a JSON parsed object.
 * @param value - The JSON parsed value that should be a [SerializableMnemonicWallet].
 */
const deserializeMnemonicWallet = (
  value: Partial<SerializableMnemonicWallet>,
): SerializableMnemonicWallet => {
  if (
    value.type === undefined ||
    value.version === undefined ||
    value.address === undefined ||
    value.hdPath === undefined ||
    value.privateKey === undefined ||
    value.addressPrefix === undefined
  ) {
    throw new Error('invalid serialized mnemonic wallet');
  }

  if (value.type !== WalletType.Mnemonic) {
    throw new Error(`invalid mnemonic wallet wallet type: ${value.type}`);
  }

  // Skip version check, at the moment we just have one version.

  const path = stringToPath(value.hdPath);
  if (path.length !== 5) {
    throw new Error(`invalid hd path, expect length to be 5 but was ${path.length}`);
  }

  return {
    type: value.type,
    version: value.version,
    address: value.address,
    hdPath: value.hdPath,
    privateKey: value.privateKey,
    addressPrefix: value.addressPrefix,
  };
};

/**
 * Deserialize a [SerializableLedgerWallet] from a JSON parsed object.
 * @param value - The JSON parsed value that should be a [SerializableLedgerWallet].
 */
const deserializeLedgerWallet = (
  value: Partial<SerializableLedgerWallet>,
): SerializableLedgerWallet => {
  if (
    value.version === undefined ||
    value.type === undefined ||
    value.address === undefined ||
    value.hdPath === undefined ||
    value.ledgerAppName === undefined ||
    value.addressPrefix === undefined
  ) {
    throw new Error('invalid serialized ledger wallet');
  }

  if (value.type !== WalletType.Ledger) {
    throw new Error(`invalid ledger wallet wallet type: ${value.type}`);
  }

  // Skip version check, at the moment we just have one version.

  const path = stringToPath(value.hdPath);
  if (path.length !== 5) {
    throw new Error(`invalid hd path, expect length to be 5 but was ${path.length}`);
  }

  return {
    version: value.version,
    type: value.type,
    address: value.address,
    hdPath: value.hdPath,
    addressPrefix: value.addressPrefix,
    ledgerAppName: value.ledgerAppName,
  };
};

/**
 * Deserialize a [SerializableWeb3AuthWallet] from a JSON parsed object.
 * @param value - The JSON parsed value that should be a [SerializableWeb3AuthWallet].
 */
const deserializeWeb3AuthWallet = (
  value: Partial<SerializableWeb3AuthWallet>,
): SerializableWeb3AuthWallet => {
  if (
    value.version === undefined ||
    value.type === undefined ||
    value.address === undefined ||
    value.privateKey === undefined ||
    value.loginProvider === undefined ||
    value.addressPrefix === undefined
  ) {
    throw new Error('invalid serialized web3auth wallet');
  }

  if (value.type !== WalletType.Web3Auth) {
    throw new Error(`invalid web3auth wallet wallet type: ${value.type}`);
  }

  // Skip version check, at the moment we just have one version.
  return {
    version: value.version,
    type: value.type,
    address: value.address,
    privateKey: value.privateKey,
    loginProvider: value.loginProvider,
    addressPrefix: value.addressPrefix,
  };
};

/**
 * Deserialize a [SerializableWallet] from a JSON parsed object.
 * @param value - The JSON parsed value that should be a [SerializableWallet].
 */
export const deserializeWallet = (value: Partial<SerializableWallet>): SerializableWallet => {
  switch (value.type) {
    case WalletType.Ledger:
      return deserializeLedgerWallet(value);
    case WalletType.Mnemonic:
      return deserializeMnemonicWallet(value);
    case WalletType.Web3Auth:
      return deserializeWeb3AuthWallet(value);
    default:
      // @ts-ignore
      throw new Error(`can't deserialize wallet with type ${value.type}`);
  }
};
