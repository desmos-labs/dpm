import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform } from 'react-native';
import SecureTextInput from 'components/SecureTextInput';
import Typography from 'components/Typography';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import Button from 'components/Button';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { AccountWithWallet } from 'types/account';
import { checkUserPassword } from 'lib/SecureStorage';
import { useSetting } from '@recoil/settings';
import { BiometricAuthorizations } from 'types/settings';
import useGetPasswordFromBiometrics from 'hooks/useGetPasswordFromBiometrics';
import useSaveAccounts from 'hooks/useSaveAccounts';
import useTrackNewAccountAdded from 'hooks/analytics/useTrackNewAccountAdded';
import Spacer from 'components/Spacer';
import useStyles from './useStyles';

export interface CheckWalletPasswordParams {
  accounts: AccountWithWallet[];
  /**
   * Tells if the account is a new one or if has been imported.
   */
  isImported: boolean;
  /**
   * Optional password that should be used to validate the inserted password.
   * If this is undefined, the password challenge stored in the secure storage
   * will be used instead.
   */
  password?: string;
}

export type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.CHECK_WALLET_PASSWORD>;

/**
 * This screen is used to check the password of the wallet.
 * @param props
 * @constructor
 */
const CheckWalletPassword = (props: NavProps) => {
  const { t } = useTranslation('account');
  const styles = useStyles();

  const { route } = props;
  const { params } = route;
  const { accounts, password, isImported } = params;

  // --------------------------------------------------------------------------------------
  // --- Hooks
  // --------------------------------------------------------------------------------------

  const unlockWalletWithBiometrics = useSetting('unlockWalletWithBiometrics');
  const getPasswordFromBiometrics = useGetPasswordFromBiometrics(
    BiometricAuthorizations.UnlockWallet,
  );
  const { saveAccounts } = useSaveAccounts();
  const trackNewAccountAdded = useTrackNewAccountAdded(isImported);

  // --------------------------------------------------------------------------------------
  // --- Local state
  // --------------------------------------------------------------------------------------

  const [inputPassword, setInputPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [checkingPassword, setCheckingPassword] = useState(false);

  // --------------------------------------------------------------------------------------
  // --- Actions
  // --------------------------------------------------------------------------------------

  const onPasswordChange = (text: string) => {
    setInputPassword(text);
    setErrorMessage(null);
  };

  // Handles the continue button press
  const onContinuePressed = useCallback(async () => {
    setCheckingPassword(true);
    const isPasswordCorrect = await checkUserPassword(inputPassword);
    if (isPasswordCorrect) {
      const saveResult = await saveAccounts(accounts, inputPassword);
      if (saveResult.isOk()) {
        accounts.forEach((account) => {
          trackNewAccountAdded(account.account);
        });
      }
    } else {
      setErrorMessage(t('wrong confirmation password'));
    }
    setCheckingPassword(false);
  }, [inputPassword, saveAccounts, accounts, t, trackNewAccountAdded]);

  // Handles the continue button press when the biometrics are enabled
  const continueWithBiometrics = useCallback(async () => {
    setCheckingPassword(true);
    // Get the password from the biometrics
    const biometricPassword = await getPasswordFromBiometrics();
    if (biometricPassword) {
      const isPasswordCorrect = await checkUserPassword(biometricPassword);
      if (isPasswordCorrect) {
        // Save the account
        const saveResult = await saveAccounts(accounts, biometricPassword);
        if (saveResult.isOk()) {
          accounts.forEach((account) => {
            trackNewAccountAdded(account.account);
          });
        }
      } else {
        setErrorMessage(t('wrong confirmation password'));
      }
    }
    setCheckingPassword(false);
  }, [getPasswordFromBiometrics, accounts, saveAccounts, t, trackNewAccountAdded]);

  // --------------------------------------------------------------------------------------
  // --- Effects
  // --------------------------------------------------------------------------------------

  React.useEffect(() => {
    if (unlockWalletWithBiometrics) {
      setTimeout(continueWithBiometrics, 500);
    }

    // It's fine to disable the exhaustive deps check here because we only want to run this effect once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --------------------------------------------------------------------------------------
  // --- Screen rendering
  // --------------------------------------------------------------------------------------

  return (
    <StyledSafeAreaView
      topBar={<TopBar stackProps={props} />}
      touchableWithoutFeedbackDisabled={false}
    >
      <Typography.H5>{t('confirm password')}</Typography.H5>
      <Spacer paddingVertical={5} />
      <Typography.Body>{t('enter security password')}</Typography.Body>

      <SecureTextInput
        placeholder={t('common:password')}
        style={styles.password}
        value={password}
        onChangeText={onPasswordChange}
        onSubmitEditing={onContinuePressed}
        autoFocus={!unlockWalletWithBiometrics}
      />
      {unlockWalletWithBiometrics && (
        <>
          <Spacer paddingVertical={8} />
          <Button mode="text" onPress={continueWithBiometrics} disabled={checkingPassword}>
            {t('common:use biometrics')}
          </Button>
        </>
      )}
      <Typography.Body style={styles.errorParagraph}>{errorMessage}</Typography.Body>
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS === 'ios' ? 110 : 0}
        {...(Platform.OS === 'ios' ? { behavior: 'padding' } : {})}
      >
        <Button
          style={styles.continueButton}
          mode="contained"
          loading={checkingPassword}
          disabled={checkingPassword}
          onPress={onContinuePressed}
        >
          {t('common:next')}
        </Button>
      </KeyboardAvoidingView>
    </StyledSafeAreaView>
  );
};

export default CheckWalletPassword;
