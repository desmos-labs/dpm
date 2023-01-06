import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, TextInput, View } from 'react-native';
import SecureTextInput from 'components/SecureTextInput';
import SingleButtonModal from 'modals/SingleButtonModal';
import Typography from 'components/Typography';
import useNavigateToHomeScreen from 'hooks/useNavigateToHomeScreen';
import useShowModal from 'hooks/useShowModal';
import { SettingsScreensStackParams } from 'types/navigation';
import evaluatePasswordComplexity from 'hooks/useEvaluatePasswordComplexity';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import PasswordComplexityScore from 'components/PasswordComplexityScore';
import Button from 'components/Button';
import useStyles from './useStyles';

type Props = StackScreenProps<SettingsScreensStackParams, 'CreateNewPassword'>;

const ChangeWalletPassword = (props: Props) => {
  const { navigation, route } = props;
  const { params } = route;
  const { t } = useTranslation();
  const styles = useStyles();
  const account = {} as any;
  const [password, setPassword] = useState('');
  const [confirmationPassword, setConfirmationPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const showModal = useShowModal();
  const navigateToHomeScreen = useNavigateToHomeScreen();
  const createNewPassword = route.name === 'CreateNewPassword';
  const inputRef = useRef<TextInput>(null);

  const onPasswordChange = (text: string) => {
    setPassword(text);
    setErrorMessage(null);
  };

  const onConfirmationPasswordChange = (text: string) => {
    setConfirmationPassword(text);
    setErrorMessage(null);
  };

  const navigateToCreateNewPassword = useCallback(
    (wallet?: any) => {
      navigation.navigate({
        name: 'CreateNewPassword',
        params: wallet ? { wallet } : {},
      });
    },
    [navigation],
  );

  const saveUserPassword = useCallback(async () => {
    showModal(SingleButtonModal, {
      image: 'password-success',
      title: t('success'),
      message: t('password changed'),
      actionLabel: t('go to profile'),
      action: () => navigateToHomeScreen({ reset: true }),
    });
  }, [account.type, navigateToHomeScreen, params?.wallet, password, showModal, t]);

  const checkUserPassword = useCallback(async () => {}, [
    account.address,
    account.type,
    navigateToCreateNewPassword,
    password,
  ]);

  const onContinuePressed = async () => {
    if (createNewPassword && password !== confirmationPassword) {
      setErrorMessage(t('wrong confirmation password'));
      return;
    }
    if (!createNewPassword && !password) {
      setErrorMessage(t('empty password'));
      return;
    }
    if (createNewPassword && evaluatePasswordComplexity(password) === 0) {
      setErrorMessage(t('password too short'));
      return;
    }
    if (!createNewPassword) {
      checkUserPassword().catch(() => setErrorMessage(t('wrong password')));
    } else if (createNewPassword && password === confirmationPassword) {
      saveUserPassword().catch((e) => setErrorMessage(t('failed to save password') + e));
    }
  };

  const handleSubmit = () => {
    if (createNewPassword) {
      if (!inputRef.current?.isFocused()) {
        inputRef.current?.focus();
        return;
      }
    }
    onContinuePressed();
  };

  return (
    <StyledSafeAreaView style={styles.root} topBar={<TopBar stackProps={props} />}>
      <Typography.Title>
        {createNewPassword ? t('create a new password') : t('change your password')}
      </Typography.Title>
      <View style={styles.passwordLabel}>
        <Typography.Body>
          {createNewPassword ? t('enter your new password') : t('enter your old password')}
        </Typography.Body>
        {createNewPassword && (
          <PasswordComplexityScore score={evaluatePasswordComplexity(password)} />
        )}
      </View>
      <SecureTextInput
        placeholder={t('password')}
        style={styles.password}
        value={password}
        onChangeText={onPasswordChange}
        onSubmitEditing={handleSubmit}
        autoFocus
      />
      {createNewPassword && (
        <>
          <Typography.Body style={styles.passwordComplexityHint}>
            {t('password complexity hint')}.
          </Typography.Body>
          <View style={styles.passwordLabel}>
            <Typography.Body>{t('confirm password')}</Typography.Body>
          </View>
          <SecureTextInput
            inputRef={inputRef}
            placeholder={t('password')}
            style={styles.password}
            value={confirmationPassword}
            onChangeText={onConfirmationPasswordChange}
            onSubmitEditing={onContinuePressed}
          />
        </>
      )}

      <Typography.Body style={styles.errorParagraph}>{errorMessage}</Typography.Body>
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS === 'ios' ? 110 : 0}
        {...(Platform.OS === 'ios' ? { behavior: 'padding' } : {})}
      >
        <Button
          mode="contained"
          onPress={onContinuePressed}
          disabled={createNewPassword ? !(password && confirmationPassword) : !password}
        >
          {createNewPassword ? t('confirm') : t('next')}
        </Button>
      </KeyboardAvoidingView>
    </StyledSafeAreaView>
  );
};

export default ChangeWalletPassword;
