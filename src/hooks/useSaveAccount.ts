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
import ROUTES from 'navigation/routes';
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

/**
 * Hook to save a new account to the device.
 * If it's the first account, it will also save the user password.
 *
 * During the saving, it displays a modal in order to inform the user that the account is being saved.
 */
const useSaveAccount = () => {
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
  const [savingAccount, setSavingAccount] = useState(false);

  // Callback to be used when the saving fails
  const onErrorPressed = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // Callback to be used when the saving is completed
  const onContinuePressed = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [{ name: ROUTES.HOME_TABS }],
    });
  }, [navigation]);

  // Callback to be used when the saving fails
  const onError = useCallback(
    (account: AccountWithWallet) => {
      // Stop the loading
      setSavingAccount(false);

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
  const saveAccount = useCallback(
    async (
      account: AccountWithWallet,
      password: string,
    ): Promise<Result<void, SecureStorageError>> => {
      setSavingAccount(true);

      // Show the loading modal
      showLoadingModal(LoadingModal, {
        text: t('saving account'),
      });

      // Save everything
      const saveResult = await saveWallet(account.wallet, password);
      if (saveResult.isErr()) {
        onError(account);
        return saveResult;
      }

      if (savingFirstAccount) {
        // Set the wallet password
        const passwordResult = await setUserPassword(password);
        if (passwordResult.isErr()) {
          onError(account);
          return saveResult;
        }
      }

      // Store the account and set it as active
      storeAccount(account.account);
      setActiveAccountAddress(account.wallet.address);

      // Hide the loading modal
      hideLoadingModal();

      // Show the success modal
      showSuccessModal(SingleButtonModal, {
        image: DPMImages.Success,
        title: t('account saved'),
        message: t('account ready to be used'),
        actionLabel: t('common:continue'),
        action: onContinuePressed,
      });

      // Stop the loading indicator
      setSavingAccount(false);
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
    saveAccount,
    savingAccount,
  };
};

export default useSaveAccount;
