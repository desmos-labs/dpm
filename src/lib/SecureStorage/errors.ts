// Suppress lint error to keep all the SecureStorage related errors in on file.
/* eslint-disable max-classes-per-file */

export enum SecureStoreErrorType {
  InvalidPassword = 'SecureStorageErrorInvalidPassword',
  EncryptionFailed = 'SecureStorageErrorEncryptionFailed',
  CorruptedData = 'SecureStorageErrorCorruptedData',
  WalletNotFound = 'SecureStorageErrorWalletNotFound',
  UnknownError = 'SecureStorageErrorUnknownError',
}

export class InvalidPasswordError extends Error {
  constructor() {
    super();
    this.name = SecureStoreErrorType.InvalidPassword;
  }
}

export class EncryptionFailedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = SecureStoreErrorType.EncryptionFailed;
  }
}

export class CorruptedDataError extends Error {
  constructor() {
    super();
    this.name = SecureStoreErrorType.CorruptedData;
  }
}

export class WalletNotFoundError extends Error {
  readonly address: string;

  constructor(address: string) {
    super(`Wallet with address ${address} not found`);
    this.address = address;
    this.name = SecureStoreErrorType.WalletNotFound;
  }
}

export class UnknownSecureStorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = SecureStoreErrorType.UnknownError;
  }
}

export type SecureStorageError =
  | InvalidPasswordError
  | CorruptedDataError
  | WalletNotFoundError
  | UnknownSecureStorageError;

export function isInvalidPasswordError(error: Error): error is InvalidPasswordError {
  return error.name === SecureStoreErrorType.InvalidPassword;
}

export function isEncryptionFailedError(error: Error): error is EncryptionFailedError {
  return error.name === SecureStoreErrorType.EncryptionFailed;
}

export function isCorruptedDataError(error: Error): error is CorruptedDataError {
  return error.name === SecureStoreErrorType.CorruptedData;
}

export function isWalletNotFoundError(error: Error): error is WalletNotFoundError {
  return error.name === SecureStoreErrorType.WalletNotFound;
}

export function isUnknownSecureStorageError(error: Error): error is UnknownSecureStorageError {
  return error.name === SecureStoreErrorType.UnknownError;
}
