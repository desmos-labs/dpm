import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import { HdPath } from '@cosmjs/crypto';
import { LedgerApp } from 'types/ledger';
import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';
import { WalletType } from 'types/wallet';
import ROUTES from 'navigation/routes';
import { useConnectToLedger } from 'hooks/useConnectToLedger';
import { WalletPickerMode } from 'screens/SelectAccount/components/AccountPicker/types';
import { useSelectAccount } from 'hooks/useSelectAccount';
import { AccountWithWallet } from 'types/account';

/**
 * Parameters to import an account from a mnemonic.
 */
export interface MnemonicAccountImportParams {
  readonly type: WalletType.Mnemonic;
  /**
   * Bech32 address prefix.
   */
  readonly addressPrefix: string;
  /**
   * Derivation path used to derive the accounts.
   */
  readonly masterHdPath: HdPath;
  /**
   * List of hd paths that will be ignored
   * during the import procedure.
   */
  readonly ignorePaths?: HdPath[];
}

/**
 * Parameters to import an account from a Ledger device.
 */
export interface LedgerAccountImportParams {
  readonly type: WalletType.Ledger;
  /**
   * Bech32 address prefix.
   */
  readonly addressPrefix: string;
  /**
   * Derivation path used to derive the accounts.
   */
  readonly masterHdPath: HdPath;
  /**
   * Application that will be used during the import process.
   */
  readonly ledgerApp: LedgerApp;
  /**
   * List of hd paths that will be ignored
   * during the import procedure.
   */
  readonly ignorePaths?: HdPath[];
}

/**
 * Parameters to import an account from Web3Auth.
 */
export interface Web3AuthImportParams {
  readonly type: WalletType.Web3Auth;
  readonly addressPrefix: string;
}

export type AccountCreationParams =
  | MnemonicAccountImportParams
  | LedgerAccountImportParams
  | Web3AuthImportParams;

/**
 * Hook that starts a flow that allow the user to import an account from a mnemonic.
 */
export const useImportMnemonicAccount = () => {
  const navigator = useNavigation<StackNavigationProp<RootNavigatorParamList>>();

  const importMnemonicAccount = useCallback(
    (params: MnemonicAccountImportParams) =>
      new Promise<AccountWithWallet | undefined>((resolve) => {
        navigator.navigate({
          name: ROUTES.CREATE_ACCOUNT_FROM_MNEMONIC,
          params: {
            masterHdPath: params.masterHdPath,
            addressPrefix: params.addressPrefix,
            allowCoinTypeEdit: false,
            ignorePaths: params.ignorePaths,
            onSelect: resolve,
            onCancel: () => {
              resolve(undefined);
            },
          },
        });
      }),
    [navigator],
  );

  return {
    importMnemonicAccount,
  };
};

/**
 * Hook that starts a flow that allow the user to import an account from a Ledger device.
 */
export const useImportLedgerAccount = () => {
  const navigator = useNavigation<StackNavigationProp<RootNavigatorParamList>>();
  const { connectToLedger } = useConnectToLedger();
  const { selectAccount } = useSelectAccount();

  const importLedgerAccount = useCallback(
    async (params: LedgerAccountImportParams): Promise<AccountWithWallet | undefined> => {
      const transport = await connectToLedger(params.ledgerApp);

      if (transport === undefined) {
        return undefined;
      }

      return selectAccount({
        mode: WalletPickerMode.Ledger,
        addressPrefix: params.addressPrefix,
        masterHdPath: params.masterHdPath,
        ledgerApp: params.ledgerApp,
        ignorePaths: params.ignorePaths,
        transport,
      });
    },
    [navigator],
  );

  return {
    importLedgerAccount,
  };
};

/**
 * Hook that starts a flow that allow the user to import an account
 * from different sources.
 */
export const useImportAccount = () => {
  const { importMnemonicAccount } = useImportMnemonicAccount();
  const { importLedgerAccount } = useImportLedgerAccount();

  const importAccount = useCallback(
    (params: AccountCreationParams) => {
      switch (params.type) {
        case WalletType.Mnemonic:
          return importMnemonicAccount(params);
        case WalletType.Ledger:
          return importLedgerAccount(params);
        default:
          throw new Error(`unsupported account type ${params.type}`);
      }
    },
    [importMnemonicAccount],
  );

  return {
    importAccount,
  };
};
