import { Route } from '@react-navigation/native';

export type AccountCreationStackParams = {
  Legal: {
    mode: 'create' | 'import' | 'ledger';
  };
};

export type AccountScreensStackParams = {
  WalletConnectCallRequest: undefined;
};

export type SettingsScreensStackParams = {
  HandleBiometrics: {
    biometricsType: 'biometricsLogin' | 'biometricsSignature';
  };
};

export type AuthorizeOperationResolveParams = {
  authorized: boolean;
};

export type RootStackParams = {
  AccountCreationScreens: undefined;
  UnlockApplication: {
    oldRoute: Route<string> | undefined;
    oldState: any;
  };
};
