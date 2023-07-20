import useSelectAccount from 'hooks/useSelectAccount';
import useSaveGeneratedAccount from 'hooks/useSaveGeneratedAccount';
import { useCallback } from 'react';
import { SupportedChain } from 'types/chains';
import { Web3AuthLoginProvider } from 'types/web3auth';
import { WalletPickerMode } from 'screens/SelectAccount/components/AccountPicker/types';
import { Web3AuthKeyProvider } from '@desmoslabs/desmjs-web3auth-mobile';
import { newWeb3AuthClient, web3AuthLoginParams } from 'lib/Web3AuthUtils';
import { PrivateKeyProviderStatus } from '@desmoslabs/desmjs';
import { useSetAppState } from '@recoil/appState';
import { Platform } from 'react-native';

const useLoginWithWeb3Auth = (chain: SupportedChain, ignoreAddresses: string[]) => {
  const selectAccount = useSelectAccount();
  const saveAccount = useSaveGeneratedAccount(false);
  const setAppState = useSetAppState();

  return useCallback(
    async (loginProvider: Web3AuthLoginProvider) => {
      const web3authClient = newWeb3AuthClient();
      await web3authClient.init();
      const keyProvider = new Web3AuthKeyProvider(web3authClient, {
        loginParams: web3AuthLoginParams(loginProvider),
      });

      setAppState(
        (currVal) =>
          Platform.select({
            android: currVal,
            // Prevent splash visualization since the app will
            // go on 'inactive' state to show a login popup to the user.
            ios: {
              ...currVal,
              noSplashScreen: true,
            },
          })!,
      );

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

      selectAccount(
        {
          mode: WalletPickerMode.Web3Auth,
          loginProvider,
          ignoreAddresses,
          addressPrefix: chain.prefix,
          privateKey: privateKey.key,
        },
        {
          onSuccess: saveAccount,
        },
      );
    },
    [setAppState, selectAccount, ignoreAddresses, chain.prefix, saveAccount],
  );
};

export default useLoginWithWeb3Auth;
