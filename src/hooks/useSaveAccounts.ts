import { useCallback, useMemo, useState } from 'react';
import { AccountWithWallet } from 'types/account';
import {
  deleteItem,
  deleteWallet,
  saveWallet,
  SecureStorageKeys,
  setUserPassword,
} from 'lib/SecureStorage';
import { useHasAccount, useStoreAccount } from '@recoil/accounts';
import useModal from 'hooks/useModal';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import SingleButtonModal from 'modals/SingleButtonModal';
import LoadingModal from 'modals/LoadingModal';
import ErrorModal from 'modals/ErrorModal';
import { useSetActiveAccountAddress } from '@recoil/activeAccount';
import { DPMImages } from 'types/images';
import { ok, Result } from 'neverthrow';
import { SecureStorageError } from 'lib/SecureStorage/errors';
import useResetToHomeScreen from 'hooks/navigation/useResetToHomeScreen';

/**
 * Hook to save a list of accounts to the device.
 * If it's the first time that the user is saving the accounts, it will also save the user password.
 *
 * During the saving, it displays a modal in order to inform the user that the account is being saved.
 */
const useSaveAccounts = () => {
  const { t } = useTranslation('account');
  const navigation = useNavigation<StackNavigationProp<RootNavigatorParamList>>();

  const hasAccount = useHasAccount();
  const savingFirstAccount = useMemo(() => !hasAccount, [hasAccount]);

  // Hooks
  const storeAccount = useStoreAccount();
  const setActiveAccountAddress = useSetActiveAccountAddress();
  const { showModal: showLoadingModal, hideModal: hideLoadingModal } = useModal();
  const { showModal: showSuccessModal } = useModal();
  const { showModal: showErrorModal } = useModal();

  // Local state
  const [savingAccounts, setSavingAccounts] = useState(false);

  // Callback to be used when the saving fails
  const onErrorPressed = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // Callback to be used when the saving is completed
  const onContinuePressed = useResetToHomeScreen();

  // Callback to be used when the saving fails
  const onError = useCallback(
    (account: AccountWithWallet) => {
      // Stop the loading
      setSavingAccounts(false);

      // Remove any possible saved data
      if (savingFirstAccount) {
        deleteItem(SecureStorageKeys.PASSWORD_CHALLENGE);
      }
      deleteWallet(account.wallet.address);

      // Show the error modal
      showErrorModal(ErrorModal, {
        text: t('error saving account'),
        action: onErrorPressed,
      });
    },
    [onErrorPressed, savingFirstAccount, showErrorModal, t],
  );

  // Callback to save the account
  const saveAccounts = useCallback(
    async (
      accounts: AccountWithWallet[],
      password: string,
    ): Promise<Result<void, SecureStorageError>> => {
      setSavingAccounts(true);

      // Show the loading modal
      showLoadingModal(LoadingModal, {
        text: accounts.length > 1 ? t('saving accounts') : t('saving account'),
      });

      for (let i = 0; i < accounts.length; i += 1) {
        const account = accounts[i];
        // Save everything
        // eslint-disable-next-line no-await-in-loop
        const saveResult = await saveWallet(account.wallet, password);
        if (saveResult.isErr()) {
          onError(account);
          return saveResult;
        }

        if (i === 0 && savingFirstAccount) {
          // Set the wallet password
          // eslint-disable-next-line no-await-in-loop
          const passwordResult = await setUserPassword(password);
          if (passwordResult.isErr()) {
            onError(account);
            return saveResult;
          }
        }

        // Store the account
        storeAccount(account.account);
      }
      setActiveAccountAddress(accounts[0].wallet.address);

      // Hide the loading modal
      hideLoadingModal();

      // Show the success modal
      showSuccessModal(SingleButtonModal, {
        image: DPMImages.Success,
        title: accounts.length > 1 ? t('accounts saved') : t('account saved'),
        message:
          accounts.length > 1 ? t('accounts ready to be used') : t('account ready to be used'),
        actionLabel: t('common:continue'),
        action: onContinuePressed,
      });

      // Stop the loading indicator
      setSavingAccounts(false);
      return ok(undefined);
    },
    [
      hideLoadingModal,
      onContinuePressed,
      onError,
      savingFirstAccount,
      setActiveAccountAddress,
      showLoadingModal,
      showSuccessModal,
      storeAccount,
      t,
    ],
  );

  return {
    saveAccounts,
    savingAccounts,
  };
};

export default useSaveAccounts;
