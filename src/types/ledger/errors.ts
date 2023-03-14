/**
 * Enum that contains the possible Ledger error types.
 */
export enum LedgerErrorType {
  ConnectionFailed = 'ConnectionFailedError',
  NoApplicationOpened = 'NoApplicationOpenedError',
  WrongApplication = 'WrongApplicationError',
  DeviceDisconnected = 'DeviceDisconnectedError',
  Unknown = 'UnknownError',
}

/**
 * Error that represents a failed connection attempt.
 */
export class ConnectionFailedError extends Error {
  public deviceMac: string;

  constructor(deviceMac: string) {
    super(`Connection with ${deviceMac} failed.`);
    this.deviceMac = deviceMac;
    this.name = LedgerErrorType.ConnectionFailed;
  }
}

/**
 * Error that tells that the expected application is not open and the
 * device is in the home screen.
 */
export class NoApplicationOpenedError extends Error {
  public expectedAppName: string;

  constructor(expectedAppName: string) {
    super(`Please open the ${expectedAppName} app on your Ledger device.`);
    this.name = LedgerErrorType.NoApplicationOpened;
    this.expectedAppName = expectedAppName;
  }
}

/**
 * Error that tells that the expected application is not open and there
 * is another application open instead.
 */
export class WrongApplicationError extends Error {
  public currentAppName: string;

  public expectedAppName: string;

  constructor(expectedAppName: string, currentAppName: string) {
    super(`Please close ${currentAppName} and open ${expectedAppName} on your Ledger device.`);
    this.name = LedgerErrorType.WrongApplication;
    this.currentAppName = currentAppName;
    this.expectedAppName = expectedAppName;
  }
}

/**
 * Error that tells that the device has been disconnected while performing an
 * operation.
 */
export class DeviceDisconnectedError extends Error {
  constructor() {
    super('Device disconnected.');
    this.name = LedgerErrorType.DeviceDisconnected;
  }
}

/**
 * Unknown Ledger error.
 */
export class UnknownLedgerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = LedgerErrorType.Unknown;
  }
}

export type LedgerError =
  | NoApplicationOpenedError
  | WrongApplicationError
  | DeviceDisconnectedError
  | UnknownLedgerError;
