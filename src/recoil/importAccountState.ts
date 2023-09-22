import { WalletType } from 'types/wallet';
import { AccountWithWallet } from 'types/account';
import { SupportedChain } from 'types/chains';
import { LedgerApp } from 'types/ledger';
import { atom } from 'recoil';

export interface ImportAccountState {
  /**
   * Chains from which the account can be imported.
   */
  readonly chains: SupportedChain[];
  /**
   * List of addresses that should be ignored while presenting the list of address
   * to the user.
   */
  readonly ignoreAddresses: string[];
  /**
   * Function called after the user have selected the account that want to import.
   */
  readonly onSuccess: (data: { accounts: AccountWithWallet[]; chain: SupportedChain }) => any;
  /**
   * Function called if the user cancel the import flow.
   */
  readonly onCancel: () => any;
  /**
   * Chain selected from the user.
   */
  readonly selectedChain?: SupportedChain;
  /**
   * Supported import mode of the selected chain.
   */
  readonly supportedImportMode?: WalletType[];
  /**
   * Import mode selected from the user.
   */
  readonly importMode?: WalletType;
  /**
   * Ledger app selected from the user.
   */
  readonly ledgerApp?: LedgerApp;
  /**
   * Tells if the ui should allow to select more then
   * on account.
   */
  readonly allowMultiSelect?: boolean;
}

/**
 * Atom that contains the import account state.
 */
const importAccountAppState = atom<ImportAccountState | undefined>({
  key: 'importAccountState',
  default: undefined,
});

export default importAccountAppState;
