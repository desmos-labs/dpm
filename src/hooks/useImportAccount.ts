import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';
import ROUTES from 'navigation/routes';
import { AccountWithWallet } from 'types/account';
import { SupportedChain } from 'types/chains';
import { useRecoilState } from 'recoil';
import importAccountAppState from '@recoil/importAccountState';
import { getChainSupportedWalletTypes } from 'lib/ChainsUtils';
import useReturnToCurrentScreen from 'hooks/useReturnToCurrentScreen';

type ImportAccountOptions = {
  title: string;
  description: string;
};

type AccountWithWalletAndChain = {
  account: AccountWithWallet;
  chain: SupportedChain;
};

/**
 * Hook that starts a flow that allow the user to import an account from either one of the supported chains.
 * @param chains - List of supported chains to be showed during the import flow.
 * @param ignoreAddresses - List of addresses that will be ignored during the account generation.
 * @param options - Details to be used on the next screen.
 *
 * <b>Note</b>: If the {@param chains} list only contains one item, the screen allowing to select the chain
 * to be imported will be skipped.
 */
const useImportAccount = (
  chains: SupportedChain[],
  ignoreAddresses?: string[],
  options?: ImportAccountOptions,
) => {
  const navigation = useNavigation<StackNavigationProp<RootNavigatorParamList>>();
  const [, setImportAccountState] = useRecoilState(importAccountAppState);
  const returnToCurrentScreen = useReturnToCurrentScreen();

  return useCallback(async (): Promise<AccountWithWalletAndChain | undefined> => {
    const data = await new Promise<AccountWithWalletAndChain | undefined>((resolve) => {
      const selectedChain: SupportedChain | undefined = chains.length === 1 ? chains[0] : undefined;

      setImportAccountState({
        chains,
        selectedChain,
        ignoreAddresses: ignoreAddresses ?? [],
        supportedImportMode:
          selectedChain === undefined ? undefined : getChainSupportedWalletTypes(chains[0]),
        onSuccess: (accountWithChain) => {
          resolve(accountWithChain);
        },
        onCancel: () => {
          resolve(undefined);
        },
      });

      switch (selectedChain) {
        case undefined:
          navigation.navigate(ROUTES.IMPORT_ACCOUNT_SELECT_CHAIN);
          break;
        default:
          navigation.navigate(ROUTES.IMPORT_ACCOUNT_SELECT_TYPE, {
            title: options?.title,
            description: options?.description,
          });
          break;
      }
    });

    await returnToCurrentScreen();
    // setImportAccountState(undefined);
    return data;
  }, [chains, ignoreAddresses, navigation, options, returnToCurrentScreen, setImportAccountState]);
};

export default useImportAccount;
