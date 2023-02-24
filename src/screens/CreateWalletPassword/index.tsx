import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, TextInput, View } from 'react-native';
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
import useSaveAccount from 'hooks/useSaveAccount';
import PasswordComplexityScore from './components/PasswordComplexityScore';
import useStyles from './useStyles';

export type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.CREATE_WALLET_PASSWORD>;

export interface CreateWalletPasswordParams {
  account: AccountWithWallet;
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
  const { account } = params;

  // --------------------------------------------------------------------------------------
  // --- Hooks
  // --------------------------------------------------------------------------------------

  const { saveAccount } = useSaveAccount();

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
      saveAccount(account, password);
    } else {
      setErrorMessage(t('wrong confirmation password'));
    }
  }, [password, confirmationPassword, saveAccount, account, t]);

  // --------------------------------------------------------------------------------------
  // --- Screen rendering
  // --------------------------------------------------------------------------------------

  return (
    <StyledSafeAreaView
      style={styles.root}
      topBar={<TopBar stackProps={props} title={t('create password')} />}
      touchableWithoutFeedbackDisabled={false}
    >
      {/* Password */}
      <Typography.Body>{t('add an extra security')}</Typography.Body>
      <View style={styles.passwordLabel}>
        <Typography.Body>{t('enter security password')}</Typography.Body>
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
      <Typography.Body style={styles.passwordComplexityHint}>
        {t('password complexity hint')}.
      </Typography.Body>

      <Spacer paddingVertical={8} />

      {/* Confirmation password */}
      <Typography.Body>{t('confirm password')}</Typography.Body>
      <SecureTextInput
        inputRef={confirmationPasswordRef}
        placeholder={t('confirm password')}
        style={styles.password}
        value={confirmationPassword}
        onChangeText={onConfirmationPasswordChanged}
        onSubmitEditing={onContinuePressed}
      />

      <Typography.Body style={styles.errorParagraph}>{errorMessage}</Typography.Body>
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS === 'ios' ? 110 : 0}
        {...(Platform.OS === 'ios' ? { behavior: 'padding' } : {})}
      >
        <Button style={styles.continueButton} mode="contained" onPress={onContinuePressed}>
          {t('common:next')}
        </Button>
      </KeyboardAvoidingView>
    </StyledSafeAreaView>
  );
};

export default CreateWalletPassword;
