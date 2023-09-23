import React, { useCallback, useState } from 'react';
import { HdPath, Slip10RawIndex } from '@cosmjs/crypto';
import { WalletGenerationData, WalletType } from 'types/wallet';
import _ from 'lodash';
import { generateAccountWithWallets } from 'lib/WalletUtils/generate';
import {
  AccountPickerParams,
  WalletPickerMode,
} from 'screens/SelectAccount/components/AccountPicker/types';
import { FetchDataFunction, usePaginatedData } from 'hooks/usePaginatedData';
import { AccountWithWallet } from 'types/account';

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
        // @ts-ignore
        setGenerationError(e.message);
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

/**
 * Hook that provides a function that can be used in the
 * usePaginatedData hook to generate the wallets.
 */
const useGetGenerateWalletFunction = () =>
  React.useCallback<FetchDataFunction<AccountWithWallet, AccountPickerParams>>(
    async (offset, limit, params) => {
      // Don't generate the accounst if the params are undefined.
      if (params === undefined) {
        return {
          data: [],
          endReached: true,
        };
      }

      let lastIndex = offset + limit;
      let unFilteredAccounts: AccountWithWallet[] = [];
      let accounts: AccountWithWallet[] = [];

      // Special case for the Ledger, the hard wallet can derive
      // private keys from an HdPath that have the account index that
      // is inisde the [0, 254] range.
      if (params.mode === WalletPickerMode.Ledger && lastIndex > 255) {
        lastIndex = 254;
      }

      if (params.mode === WalletPickerMode.Ledger || params.mode === WalletPickerMode.Mnemonic) {
        const paths: HdPath[] = _.range(offset, lastIndex)
          .map(Slip10RawIndex.hardened)
          .map((accountIndex) => {
            const path = [...params.masterHdPath];
            path[2] = accountIndex;
            return path;
          });

        unFilteredAccounts = await generateAccountWithWallets(
          generationParamsToWalletGenerationData(params, paths),
        );
      } else if (params.mode === WalletPickerMode.Web3Auth && offset === 0) {
        // Here we can generate just one account.
        unFilteredAccounts = await generateAccountWithWallets(
          generationParamsToWalletGenerationData(params, []),
        );
      }

      if (params.ignoreAddresses !== undefined && params.ignoreAddresses.length > 0) {
        accounts = unFilteredAccounts.filter(
          ({ account }) => params.ignoreAddresses!.indexOf(account.address) === -1,
        );
      } else {
        accounts = unFilteredAccounts;
      }

      return {
        data: accounts,
        endReached: unFilteredAccounts.length < limit,
      };
    },
    [],
  );

/**
 * Hook that provides a set of function to lazily generate the wallets.
 */
export const useGeneratePaginatedWallets = (params: AccountPickerParams) => {
  const generateFunction = useGetGenerateWalletFunction();

  return usePaginatedData(
    generateFunction,
    {
      itemsPerPage: 10,
    },
    params,
  );
};
