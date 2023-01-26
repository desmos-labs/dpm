import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';
import ROUTES from 'navigation/routes';
import { SupportedChain } from 'types/chains';
import { useRecoilState } from 'recoil';
import importAccountAppState from '@recoil/importAccountState';
import { getChainSupportedWalletTypes } from 'lib/ChainsUtils';
import useSaveAccount from 'hooks/useSaveAccount';
import { useTranslation } from 'react-i18next';

/**
 * Hook that starts a flow that allow the user to import an account from either one of the supported chains
 * and store it in the device storage.
 * @param chains - List of supported chains to be showed during the import flow.
 * @param ignoreAddresses - List of addresses that will be ignored during the account generation.
 *
 * <b>Note</b>: If the {@param chains} list only contains one item, the screen allowing to select the chain
 * to be imported will be skipped.
 */
const useImportAccount = (chains: SupportedChain[], ignoreAddresses?: string[]) => {
  const { t } = useTranslation('account');
  const navigation = useNavigation<StackNavigationProp<RootNavigatorParamList>>();
  const [, setImportAccountState] = useRecoilState(importAccountAppState);
  const saveAccount = useSaveAccount();

  return useCallback(() => {
    const selectedChain: SupportedChain | undefined = chains.length === 1 ? chains[0] : undefined;
    setImportAccountState({
      chains,
      selectedChain,
      ignoreAddresses: ignoreAddresses ?? [],
      supportedImportMode:
        selectedChain === undefined ? undefined : getChainSupportedWalletTypes(chains[0]),
      onSuccess: (accountWithChain) => {
        saveAccount(accountWithChain.account);
      },
      onCancel: () => {},
    });

    switch (selectedChain) {
      case undefined:
        navigation.navigate(ROUTES.IMPORT_ACCOUNT_SELECT_CHAIN);
        break;
      default:
        navigation.navigate(ROUTES.IMPORT_ACCOUNT_SELECT_TYPE, {
          title: t('import account')!,
          description: t('select connection method')!,
        });
        break;
    }
  }, [chains, ignoreAddresses, navigation, saveAccount, setImportAccountState, t]);
};

export default useImportAccount;
