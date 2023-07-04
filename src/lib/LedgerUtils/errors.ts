import {
  ApplicationNotInstalledError,
  ApplicationOpenRejectedError,
  ConnectionFailedError,
  DeviceDisconnectedError,
  LedgerError,
  LedgerErrorType,
  NoApplicationOpenedError,
  UnknownLedgerError,
  WrongApplicationError,
} from 'types/ledger';

/**
 * Function to convert an Error raised during a Ledger operation to
 * one of the error that the app can manage.
 * @param e - The error to convert.
 * @param fallbackMsg - Fallback message in case we are unable to convert the error.
 */
export const convertErrorToLedgerError = (e: unknown, fallbackMsg: string): LedgerError => {
  if (typeof e !== 'object') {
    return new UnknownLedgerError(fallbackMsg);
  }

  const castedError = e as Partial<Error> | undefined;
  if (castedError?.message === undefined) {
    return new UnknownLedgerError(fallbackMsg);
  }

  if (castedError.message.includes('was disconnected')) {
    const messageTokens = castedError.message.split(' ');
    const deviceMac = messageTokens[1];
    return new ConnectionFailedError(deviceMac);
  }

  if (castedError.message.includes('Ledger Native Error: DisconnectedDevice')) {
    return new DeviceDisconnectedError();
  }

  if (castedError.message.includes('Please close')) {
    const messageTokens = castedError.message.split(' ');
    const currentAppName = messageTokens[2];
    const expectedApp = messageTokens[6];

    if (currentAppName === 'BOLOS') {
      return new NoApplicationOpenedError(expectedApp);
    }

    return new WrongApplicationError(expectedApp, currentAppName);
  }

  if (castedError.message.includes('(0x6807)')) {
    return new ApplicationNotInstalledError();
  }

  if (castedError.message.includes('(0x5501)')) {
    return new ApplicationOpenRejectedError();
  }

  return new UnknownLedgerError(castedError.message);
};

/**
 * Function to check if the provided error is an instance of ConnectionFailedError.
 * @param error - Error to check.
 */
export function isConnectionFailedError(error: LedgerError): error is ConnectionFailedError {
  return error.name === LedgerErrorType.ConnectionFailed;
}

/**
 * Function to check if the provided error is an instance of NoApplicationOpenedError.
 * @param error - Error to check.
 */
export function isNoApplicationOpenedError(error: LedgerError): error is NoApplicationOpenedError {
  return error.name === LedgerErrorType.NoApplicationOpened;
}

/**
 * Function to check if the provided error is an instance of WrongApplicationError.
 * @param error - Error to check.
 */
export function isWrongApplicationError(error: LedgerError): error is WrongApplicationError {
  return error.name === LedgerErrorType.WrongApplication;
}

/**
 * Function to check if the provided error is an instance of ApplicationOpenRejectedError.
 * @param error - Error to check.
 */
export function isApplicationOpenRejectedError(
  error: LedgerError,
): error is ApplicationOpenRejectedError {
  return error.name === LedgerErrorType.ApplicationOpenRejected;
}

/**
 * Function to check if the provided error is an instance of ApplicationNotInstalledError.
 * @param error - Error to check.
 */
export function isApplicationNotInstalledError(
  error: LedgerError,
): error is ApplicationNotInstalledError {
  return error.name === LedgerErrorType.ApplicationNotInstalled;
}

/**
 * Function to check if the provided error is an instance of UnknownLedgerError.
 * @param error - Error to check.
 */
export function isUnknownLedgerError(error: LedgerError): error is UnknownLedgerError {
  return error.name === LedgerErrorType.Unknown;
}
