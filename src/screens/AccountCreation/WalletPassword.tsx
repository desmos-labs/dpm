import { StackScreenProps } from '@react-navigation/stack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { Button, PasswordComplexity, StyledSafeAreaView, TopBar } from '../../components';
import SecureTextInput from '../../components/SecureTextInput';
import { Typography } from '../../components/typography';
import { makeStyle } from '../../theming';
import { AccountCreationStackParams } from '../../types/navigation';
import evaluatePasswordComplexity from '../../utilils/passwordEvaluation';
import * as SecureStorage from '../../utilils/SecureStorage';

type CreatePasswordProps = StackScreenProps<AccountCreationStackParams, 'CreateWalletPassword'>;
type CheckPasswordProps = StackScreenProps<AccountCreationStackParams, 'CheckWalletPassword'>;
type Props = CreatePasswordProps | CheckPasswordProps;

export default function WalletPassword(props: Props): JSX.Element {
  const { navigation, route } = props;
  const { t } = useTranslation();
  const styles = useStyles();
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isCreatePassword = route.name === 'CreateWalletPassword';
  const addingNewAccount = route.params?.addingNewAccount;

  const onPasswordChange = (text: string) => {
    setPassword(text);
    setErrorMessage(null);
  };

  const onContinuePressed = async () => {
    if (isCreatePassword) {
      if (evaluatePasswordComplexity(password) === 0) {
        setErrorMessage(t('password too short'));
        return;
      }
      navigation.navigate({
        name: 'CheckWalletPassword',
        params: {
          ...route.params,
          password,
          addingNewAccount: false,
        },
      });
    } else if (password !== route.params?.password && !addingNewAccount) {
      setErrorMessage(t('wrong confirmation password'));
    } else if (addingNewAccount) {
      SecureStorage.getItem('dpm_global_password', {
        password,
      })
        .then((result) => {
          if (result === 'dpm_global_password') {
            navigation.navigate({
              name: 'GenerateAccount',
              params: {
                wallet: route.params.wallet,
                password,
              },
            });
          }
        })
        .catch(() => setErrorMessage(t('wrong confirmation password')));
    } else {
      navigation.navigate({
        name: 'GenerateAccount',
        params: {
          wallet: route.params.wallet,
          password,
        },
      });
    }
  };

  return (
    <StyledSafeAreaView style={styles.root} topBar={<TopBar stackProps={props} />}>
      <Typography.Title>
        {isCreatePassword ? t('create password') : t('confirm password')}
      </Typography.Title>
      {isCreatePassword && <Typography.Body>{t('add an extra security')}</Typography.Body>}
      <View style={styles.passwordLabel}>
        <Typography.Body>{t('enter security password')}</Typography.Body>
        {isCreatePassword && <PasswordComplexity score={evaluatePasswordComplexity(password)} />}
      </View>
      <SecureTextInput
        placeholder={t('password')}
        style={styles.password}
        value={password}
        onChangeText={onPasswordChange}
        onSubmitEditing={onContinuePressed}
        autoFocus
      />
      {isCreatePassword && (
        <Typography.Body style={styles.passwordComplexityHint}>
          {t('password complexity hint')}.
        </Typography.Body>
      )}
      <Typography.Body style={styles.errorParagraph}>{errorMessage}</Typography.Body>
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS === 'ios' ? 110 : 0}
        {...(Platform.OS === 'ios' ? { behavior: 'padding' } : {})}
      >
        <Button style={styles.continueButton} mode="contained" onPress={onContinuePressed}>
          {isCreatePassword ? t('next') : t('confirm')}
        </Button>
      </KeyboardAvoidingView>
    </StyledSafeAreaView>
  );
}

const useStyles = makeStyle((theme) => ({
  root: {
    paddingTop: 0,
  },
  passwordLabel: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: theme.spacing.m,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  password: {
    marginTop: theme.spacing.s,
  },
  passwordComplexityHint: {
    marginTop: theme.spacing.s,
  },
  continueButton: {
    marginTop: theme.spacing.s,
  },
  errorParagraph: {
    color: theme.colors.error,
    marginTop: theme.spacing.s,
    flexGrow: 1,
  },
}));
