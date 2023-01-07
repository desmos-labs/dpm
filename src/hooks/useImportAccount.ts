import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import { HdPath } from '@cosmjs/crypto';
import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';
import ROUTES from 'navigation/routes';
import { AccountWithWallet } from 'types/account';
import { SupportedChain } from 'types/chains';
import { useRecoilState } from 'recoil';
import importAccountAppState from '@recoil/importAccountState';
import { getChainSupportedWalletTypes } from 'lib/ChainsUtils';
import { useReturnToCurrentScreen } from 'hooks/useReturnToCurrentScreen';

type AccountWithWalletAndChain = {
  account: AccountWithWallet;
  chain: SupportedChain;
};

/**
 * Hook that starts a flow that allow the user to import an account from either one of the supported chains.
 * @param chains - List of supported chains to be showed during the import flow.
 * @param ignoreHdPaths - List of derivation path that will be ignored during the account generation.
 *
 * <b>Note</b>: If the {@param chains} list only contains one item, the screen allowing to select the chain
 * to be imported will be skipped.
 */
export const useImportAccount = (chains: SupportedChain[], ignoreHdPaths?: HdPath[]) => {
  const navigation = useNavigation<StackNavigationProp<RootNavigatorParamList>>();
  const [, setImportAccountState] = useRecoilState(importAccountAppState);
  const { returnToCurrentScreen } = useReturnToCurrentScreen();

  const importAccount = useCallback(async (): Promise<AccountWithWalletAndChain | undefined> => {
    const data = await new Promise<AccountWithWalletAndChain | undefined>((resolve) => {
      const selectedChain: SupportedChain | undefined = chains.length === 1 ? chains[0] : undefined;

      setImportAccountState({
        chains,
        selectedChain,
        ignoreHdPaths: ignoreHdPaths ?? [],
        supportedImportMode:
          selectedChain === undefined ? undefined : getChainSupportedWalletTypes(chains[0]),
        onSuccess: (accountWithChain) => {
          resolve(accountWithChain);
        },
        onCancel: () => {
          resolve(undefined);
        },
      });

      navigation.navigate({
        name:
          selectedChain === undefined
            ? ROUTES.IMPORT_ACCOUNT_SELECT_CHAIN
            : ROUTES.IMPORT_ACCOUNT_SELECT_TYPE,
        params: undefined,
      });
    });

    await returnToCurrentScreen();
    // setImportAccountState(undefined);
    return data;
  }, [chains, ignoreHdPaths, navigation, returnToCurrentScreen, setImportAccountState]);

  return {
    importAccount,
  };
};