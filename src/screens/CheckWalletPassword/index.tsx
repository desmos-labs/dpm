import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import SecureTextInput from 'components/SecureTextInput';
import Typography from 'components/Typography';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import Button from 'components/Button';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { AccountWithWallet } from 'types/account';
import { checkUserPassword } from 'lib/SecureStorage';
import { useSettings } from '@recoil/settings';
import { BiometricAuthorizations } from 'types/settings';
import useGetPasswordFromBiometrics from 'hooks/useGetPasswordFromBiometrics';
import useSaveAccount from 'hooks/useSaveAccount';
import useTrackNewAccountAdded from 'hooks/analytics/useTrackNewAccountAdded';
import useStyles from './useStyles';

export interface CheckWalletPasswordParams {
  account: AccountWithWallet;
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
  const { account, password, isImported } = params;

  // --------------------------------------------------------------------------------------
  // --- Hooks
  // --------------------------------------------------------------------------------------

  const appSettings = useSettings();
  const getPasswordFromBiometrics = useGetPasswordFromBiometrics(
    BiometricAuthorizations.UnlockWallet,
  );
  const { saveAccount } = useSaveAccount();
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
      const saveResult = await saveAccount(account, inputPassword);
      if (saveResult.isOk()) {
        trackNewAccountAdded(account.account);
      }
    } else {
      setErrorMessage(t('wrong confirmation password'));
    }
    setCheckingPassword(false);
  }, [inputPassword, saveAccount, account, t, trackNewAccountAdded]);

  // Handles the continue button press when the biometrics are enabled
  const continueWithBiometrics = useCallback(async () => {
    setCheckingPassword(true);
    // Get the password from the biometrics
    const biometricPassword = await getPasswordFromBiometrics();
    if (biometricPassword) {
      const isPasswordCorrect = await checkUserPassword(biometricPassword);
      if (isPasswordCorrect) {
        // Save the account
        const saveResult = await saveAccount(account, biometricPassword);
        if (saveResult.isOk()) {
          trackNewAccountAdded(account.account);
        }
      } else {
        setErrorMessage(t('wrong confirmation password'));
      }
    }
    setCheckingPassword(false);
  }, [getPasswordFromBiometrics, account, saveAccount, t, trackNewAccountAdded]);

  // --------------------------------------------------------------------------------------
  // --- Effects
  // --------------------------------------------------------------------------------------

  React.useEffect(() => {
    if (appSettings.unlockWalletWithBiometrics) {
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
      style={styles.root}
      topBar={<TopBar stackProps={props} title={t('confirm password')} />}
      touchableWithoutFeedbackDisabled={false}
    >
      <View style={styles.passwordLabel}>
        <Typography.Body>{t('enter security password')}</Typography.Body>
      </View>
      <SecureTextInput
        placeholder={t('common:password')}
        style={styles.password}
        value={password}
        onChangeText={onPasswordChange}
        onSubmitEditing={onContinuePressed}
        autoFocus={!appSettings.unlockWalletWithBiometrics}
      />
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
