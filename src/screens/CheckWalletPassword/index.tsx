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
import useStyles from './useStyles';

export interface CheckWalletPasswordParams {
  account: AccountWithWallet;
  /**
   * Optional password that should be used to validate the inserted password.
   * If this is undefined, the password challenge stored in the secure storage
   * will be used instead.
   */
  password?: string;
}

export type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.CHECK_WALLET_PASSWORD>;

const CheckWalletPassword = (props: NavProps) => {
  const { navigation, route } = props;
  const { t } = useTranslation();
  const styles = useStyles();
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onPasswordChange = (text: string) => {
    setPassword(text);
    setErrorMessage(null);
  };

  const onContinuePressed = useCallback(async () => {
    let isPasswordCorrect: boolean;

    if (route.params.password === undefined) {
      isPasswordCorrect = await checkUserPassword(password).catch(() => false);
    } else {
      isPasswordCorrect = route.params.password === password;
    }

    if (isPasswordCorrect) {
      navigation.navigate(ROUTES.SAVE_GENERATED_ACCOUNT, {
        account: route.params.account,
        password,
      });
    } else {
      setErrorMessage(t('wrong confirmation password'));
    }
  }, [navigation, password, route, t]);

  return (
    <StyledSafeAreaView style={styles.root} topBar={<TopBar stackProps={props} />}>
      <Typography.Title>{t('confirm password')}</Typography.Title>
      <View style={styles.passwordLabel}>
        <Typography.Body>{t('enter security password')}</Typography.Body>
      </View>
      <SecureTextInput
        placeholder={t('password')}
        style={styles.password}
        value={password}
        onChangeText={onPasswordChange}
        onSubmitEditing={onContinuePressed}
        autoFocus
      />
      <Typography.Body style={styles.errorParagraph}>{errorMessage}</Typography.Body>
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS === 'ios' ? 110 : 0}
        {...(Platform.OS === 'ios' ? { behavior: 'padding' } : {})}
      >
        <Button style={styles.continueButton} mode="contained" onPress={onContinuePressed}>
          {t('next')}
        </Button>
      </KeyboardAvoidingView>
    </StyledSafeAreaView>
  );
};

export default CheckWalletPassword;
