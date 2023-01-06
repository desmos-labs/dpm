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
        console.error(e);
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
      let paths = _.range(start, end)
        .map(Slip10RawIndex.hardened)
        .map((accountIndex) => {
          const path = [...params.masterHdPath];
          path[2] = accountIndex;
          return path;
        });

      // Filter ignore paths from the list.
      if (params.ignorePaths !== undefined && params.ignorePaths.length > 0) {
        const { ignorePaths } = params;
        paths = paths.filter(
          (path) => ignorePaths.find((ignorePath) => _.isEqual(ignorePath, path)) === undefined,
        );
      }

      return generateAccountWithWallets(generationParamsToWalletGenerationData(params, paths));
    },
    [params],
  );

  return {
    fetchWallets,
  };
};
