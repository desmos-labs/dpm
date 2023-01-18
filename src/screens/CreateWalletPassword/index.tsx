import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import SecureTextInput from 'components/SecureTextInput';
import Typography from 'components/Typography';
import evaluatePasswordComplexity from 'hooks/useEvaluatePasswordComplexity';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import PasswordComplexityScore from 'components/PasswordComplexityScore';
import Button from 'components/Button';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { AccountWithWallet } from 'types/account';
import useStyles from './useStyles';

export type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.CREATE_WALLET_PASSWORD>;

export interface CreateWalletPasswordParams {
  account: AccountWithWallet;
}

const CreateWalletPassword = (props: NavProps) => {
  const { t } = useTranslation('account');
  const styles = useStyles();

  const { navigation, route } = props;

  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onPasswordChange = (text: string) => {
    setPassword(text);
    setErrorMessage(null);
  };

  const onContinuePressed = useCallback(async () => {
    navigation.navigate(ROUTES.CHECK_WALLET_PASSWORD, {
      password,
      account: route.params.account,
    });
  }, [navigation, password, route.params.account]);

  return (
    <StyledSafeAreaView style={styles.root} topBar={<TopBar stackProps={props} />}>
      <Typography.Title>{t('create password')}</Typography.Title>
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
        onSubmitEditing={onContinuePressed}
        autoFocus
      />
      <Typography.Body style={styles.passwordComplexityHint}>
        {t('password complexity hint')}.
      </Typography.Body>
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
