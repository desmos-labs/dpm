import { useCallback, useState } from 'react';
import { HdPath, Slip10RawIndex } from '@cosmjs/crypto';
import { Wallet, WalletGenerationData, WalletType } from 'types/wallet';
import _ from 'lodash';
import { generateWallets } from 'lib/WalletUtils/generate';
import {
  WalletPickerMode,
  WalletPickerParams,
} from 'screens/PickDerivationPath/components/WalletPicker/types';

function generationParamsToWalletGenerationData(
  params: WalletPickerParams,
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

export const useGenerateWalletFromHdPath = () => {
  const [walletGenerationError, setGenerationError] = useState<string>();

  const generateWalletFromHdPath = useCallback(
    async (hdPath: HdPath, generationParams: WalletPickerParams) => {
      try {
        const wallets = await generateWallets(
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
    walletGenerationError,
    generateWalletFromHdPath,
  };
};

export const useFetchWallets = (params: WalletPickerParams) => {
  const { generateWalletFromHdPath } = useGenerateWalletFromHdPath();

  const fetchWallets = useCallback(
    async (offset: number, limit: number) => {
      if (offset + limit >= 256) {
        return null;
      }

      let paths = _.range(offset, offset + limit)
        .map(Slip10RawIndex.hardened)
        .map((accountIndex) => {
          const path = [...params.masterHdPath];
          path[2] = accountIndex;
          return path;
        });

      // Filter ignore paths from the list.
      if (params.ignorePaths !== undefined && params.ignorePaths.length > 0) {
        paths = paths.filter(
          (path) =>
            params.ignorePaths?.find((ignorePath) => _.isEqual(ignorePath, path)) !== undefined,
        );
      }

      return generateWallets(generationParamsToWalletGenerationData(params, paths));
    },
    [params, generateWalletFromHdPath],
  );

  return {
    fetchWallets,
  };
};
