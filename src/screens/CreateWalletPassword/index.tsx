import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextInput, View } from 'react-native';
import SecureTextInput from 'components/SecureTextInput';
import Typography from 'components/Typography';
import evaluatePasswordComplexity from 'hooks/useEvaluatePasswordComplexity';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import Button from 'components/Button';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { AccountWithWallet } from 'types/account';
import Spacer from 'components/Spacer';
import useSaveAccounts from 'hooks/useSaveAccounts';
import useTrackNewAccountAdded from 'hooks/analytics/useTrackNewAccountAdded';
import ErrorMessage from 'components/ErrorMessage';
import Flexible from 'components/Flexible';
import DKeyboardAvoidingView from 'components/DKeyboardAvoidingView';
import PasswordComplexityScore from './components/PasswordComplexityScore';
import useStyles from './useStyles';

export type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.CREATE_WALLET_PASSWORD>;

export interface CreateWalletPasswordParams {
  accounts: AccountWithWallet[];
  /**
   * Tells if the account is a new one or if has been imported.
   */
  isImported: boolean;
}

/**
 * Screen that allows the user to set a password for the wallet for the first time.
 * @param props
 * @constructor
 */
const CreateWalletPassword = (props: NavProps) => {
  const { t } = useTranslation('account');
  const styles = useStyles();

  const { route } = props;
  const { params } = route;
  const { accounts, isImported } = params;

  // --------------------------------------------------------------------------------------
  // --- Hooks
  // --------------------------------------------------------------------------------------

  const { saveAccounts } = useSaveAccounts();
  const trackNewAccountAdded = useTrackNewAccountAdded(isImported);

  // --------------------------------------------------------------------------------------
  // --- Local state
  // --------------------------------------------------------------------------------------

  const [password, setPassword] = useState('');
  const confirmationPasswordRef = useRef<TextInput>(null);
  const [confirmationPassword, setConfirmationPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // --------------------------------------------------------------------------------------
  // --- Actions
  // --------------------------------------------------------------------------------------

  const onPasswordChange = useCallback((text: string) => {
    setPassword(text);
    setErrorMessage(null);
  }, []);

  const onConfirmationPasswordChanged = useCallback((text: string) => {
    setConfirmationPassword(text);
    setErrorMessage(null);
  }, []);

  const onSubmitPassword = useCallback(() => {
    confirmationPasswordRef.current?.focus();
  }, []);

  const onContinuePressed = useCallback(async () => {
    if (password === confirmationPassword) {
      const saveResult = await saveAccounts(accounts, password);
      if (saveResult.isOk()) {
        accounts.forEach((account) => {
          trackNewAccountAdded(account.account);
        });
      }
    } else {
      setErrorMessage(t('wrong confirmation password'));
    }
  }, [password, confirmationPassword, saveAccounts, accounts, t, trackNewAccountAdded]);

  // --------------------------------------------------------------------------------------
  // --- Screen rendering
  // --------------------------------------------------------------------------------------

  return (
    <StyledSafeAreaView
      topBar={<TopBar stackProps={props} />}
      touchableWithoutFeedbackDisabled={false}
    >
      {/* Password */}
      <Typography.H5>{t('create password')}</Typography.H5>
      <Typography.Regular16>{t('add an extra security')}</Typography.Regular16>
      <View style={styles.passwordLabel}>
        <Typography.Regular16>{t('enter security password')}</Typography.Regular16>
        <PasswordComplexityScore score={evaluatePasswordComplexity(password)} />
      </View>
      <SecureTextInput
        placeholder={t('common:password')}
        style={styles.password}
        value={password}
        onChangeText={onPasswordChange}
        onSubmitEditing={onSubmitPassword}
        autoFocus
      />
      <Typography.Regular16 style={styles.passwordComplexityHint}>
        {t('password complexity hint')}.
      </Typography.Regular16>

      <Spacer paddingVertical={8} />

      {/* Confirmation password */}
      <Typography.Regular16>{t('confirm password')}</Typography.Regular16>
      <SecureTextInput
        inputRef={confirmationPasswordRef}
        placeholder={t('confirm password')}
        style={styles.password}
        value={confirmationPassword}
        onChangeText={onConfirmationPasswordChanged}
        onSubmitEditing={onContinuePressed}
        error={errorMessage !== null}
      />
      <Spacer paddingVertical={4} />
      <ErrorMessage message={errorMessage} />

      <Flexible.Padding flex={1} />

      <DKeyboardAvoidingView>
        <Button style={styles.continueButton} mode="contained" onPress={onContinuePressed}>
          {t('common:next')}
        </Button>
      </DKeyboardAvoidingView>
    </StyledSafeAreaView>
  );
};

export default CreateWalletPassword;
