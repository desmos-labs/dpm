import { useCallback, useState } from 'react';
import { HdPath, Slip10RawIndex } from '@cosmjs/crypto';
import { WalletGenerationData, WalletType } from 'types/wallet';
import _ from 'lodash';
import { generateAccountWithWallets } from 'lib/WalletUtils/generate';
import {
  AccountPickerParams,
  WalletPickerMode,
} from 'screens/SelectAccount/components/AccountPicker/types';

function generationParamsToWalletGenerationData(
  params: AccountPickerParams,
  hdPaths: HdPath[],
): WalletGenerationData {
  switch (params.mode) {
    case WalletPickerMode.Mnemonic:
      return {
        type: WalletType.Mnemonic,
        hdPaths,
        mnemonic: params.mnemonic,
        accountPrefix: params.addressPrefix,
      };
    case WalletPickerMode.Ledger:
      return {
        type: WalletType.Ledger,
        hdPaths,
        app: params.ledgerApp,
        transport: params.transport,
        accountPrefix: params.addressPrefix,
      };
    case WalletPickerMode.Web3Auth:
      return {
        type: WalletType.Web3Auth,
        accountPrefix: params.addressPrefix,
        loginProvider: params.loginProvider,
        privateKey: params.privateKey,
      };

    default:
      // @ts-ignore
      throw new Error(`can't covert WalletPickerParams with mode ${params.mode}`);
  }
}

export const useGenerateAccountWithWalletFromHdPath = () => {
  const [generationError, setGenerationError] = useState<string>();

  const generateWalletAccountFromHdPath = useCallback(
    async (hdPath: HdPath, generationParams: AccountPickerParams) => {
      try {
        const wallets = await generateAccountWithWallets(
          generationParamsToWalletGenerationData(generationParams, [hdPath]),
        );

        if (wallets.length === 0) {
          setGenerationError('no wallet generated');
          return null;
        }

        return wallets[0];
      } catch (e) {
        setGenerationError(e.toString());
        return null;
      }
    },
    [],
  );

  return {
    generationError,
    generateWalletAccountFromHdPath,
  };
};

export const useFetchWallets = (params: AccountPickerParams) => {
  const fetchWallets = useCallback(
    async (start: number, end: number) => {
      let paths: HdPath[] = [];

      if (params.mode === WalletPickerMode.Mnemonic || params.mode === WalletPickerMode.Ledger) {
        paths = _.range(start, end)
          .map(Slip10RawIndex.hardened)
          .map((accountIndex) => {
            const path = [...params.masterHdPath];
            path[2] = accountIndex;
            return path;
          });
      }

      if (paths.length === 0 && start !== 0) {
        // Fetching a second page from a mode that can't generate more than
        // one address, in this case just return null on the second page to
        // signal that the elements are finished.
        return null;
      }

      const accounts = await generateAccountWithWallets(
        generationParamsToWalletGenerationData(params, paths),
      );

      if (params.ignoreAddresses === undefined || params.ignoreAddresses.length === 0) {
        return accounts;
      }

      return accounts.filter(
        ({ account }) => params.ignoreAddresses!.indexOf(account.address) === -1,
      );
    },
    [params],
  );

  return {
    fetchWallets,
  };
};
