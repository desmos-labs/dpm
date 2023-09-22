import useSelectAccounts from 'hooks/useSelectAccounts';
import useSaveGeneratedAccounts from 'hooks/useSaveGeneratedAccounts';
import { useCallback } from 'react';
import { SupportedChain } from 'types/chains';
import { Web3AuthLoginProvider } from 'types/web3auth';
import { WalletPickerMode } from 'screens/SelectAccount/components/AccountPicker/types';
import { Web3AuthKeyProvider } from '@desmoslabs/desmjs-web3auth-mobile';
import { newWeb3AuthClient, web3AuthLoginParams } from 'lib/Web3AuthUtils';
import { PrivateKeyProviderStatus } from '@desmoslabs/desmjs';
import { useSetAppState } from '@recoil/appState';
import { useHasAccount } from '@recoil/accounts';

const useLoginWithWeb3Auth = (chain: SupportedChain, ignoreAddresses: string[]) => {
  const selectAccounts = useSelectAccounts();
  const saveAccounts = useSaveGeneratedAccounts(false);
  const setAppState = useSetAppState();
  const hasAccounts = useHasAccount();

  return useCallback(
    async (loginProvider: Web3AuthLoginProvider) => {
      const web3authClient = newWeb3AuthClient();
      await web3authClient.init();
      const keyProvider = new Web3AuthKeyProvider(web3authClient, {
        loginParams: web3AuthLoginParams(loginProvider),
      });

      // Disable splash visualization and app block during the
      // Web3Auth login flow.
      setAppState((currVal) => ({
        ...currVal,
        noSplashScreen: true,
        noLockOnBackground: hasAccounts,
      }));

      try {
        await keyProvider.connect();
      } catch (e) {
        // Ignore cancel exception.
      }

      // If not connected return.
      if (keyProvider.status !== PrivateKeyProviderStatus.Connected) {
        return;
      }

      // Get the obtained private key.
      const privateKey = await keyProvider.getPrivateKey();

      selectAccounts(
        {
          mode: WalletPickerMode.Web3Auth,
          loginProvider,
          ignoreAddresses,
          addressPrefix: chain.prefix,
          privateKey: privateKey.key,
          allowMultiSelect: false,
        },
        {
          onSuccess: saveAccounts,
        },
      );
    },
    [setAppState, selectAccounts, ignoreAddresses, chain.prefix, saveAccounts, hasAccounts],
  );
};

export default useLoginWithWeb3Auth;
