import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Button, PasswordComplexity, StyledSafeAreaView, TopBar } from '../../components';
import SecureTextInput from '../../components/SecureTextInput';
import { Typography } from '../../components/typography';
import useNavigateToHomeScreen from '../../hooks/useNavigateToHomeScreen';
import useSelectedAccount from '../../hooks/useSelectedAccount';
import useShowModal from '../../hooks/useShowModal';
import { SingleButtonModal } from '../../modals/SingleButtonModal';
import { LocalWalletsSource } from '../../sources/LocalWalletsSource';
import { makeStyle } from '../../theming';
import { ChainAccountType } from '../../types/chain';
import { resetTo, SettingsScreensStackParams } from '../../types/navigation';
import evaluatePasswordComplexity from '../../utilils/passwordEvaluation';
import * as SecureStorage from '../../utilils/SecureStorage';

type Props = StackScreenProps<SettingsScreensStackParams>;

export default function ChangeWalletPassword(props: Props): JSX.Element {
  const {
    navigation,
    route: { params },
  } = props;
  const { t } = useTranslation();
  const styles = useStyles();
  const account = useSelectedAccount();
  const [password, setPassword] = useState('');
  const [confirmationPassword, setConfirmationPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const createNewPassword = params?.wallet !== undefined;
  const showModal = useShowModal();
  const navigateToHomeScreen = useNavigateToHomeScreen();

  const onPasswordChange = (text: string) => {
    setPassword(text);
    setErrorMessage(null);
  };

  const onConfirmationPasswordChange = (text: string) => {
    setConfirmationPassword(text);
    setErrorMessage(null);
  };

  const onContinuePressed = async () => {
    if (createNewPassword && password !== confirmationPassword) {
      setErrorMessage(t('the password doesnt match'));
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
      try {
        const passwordMatch =
          account.address ===
          (await SecureStorage.getItem(`${account.address}-auth-challenge`, {
            password,
          }));
        if (passwordMatch) {
          if (account.type === ChainAccountType.Local) {
            LocalWalletsSource.getWallet(account.address, password).then((wallet) => {
              navigation.navigate({
                name: 'CreateNewPassword',
                params: {
                  wallet,
                },
              });
            });
          } else {
            navigation.navigate({
              name: 'CreateNewPassword',
              params: {},
            });
          }
        }
      } catch (error) {
        if (error) {
          setErrorMessage(t('wrong password'));
        }
      }
    } else if (createNewPassword && params?.wallet && password === confirmationPassword) {
      await SecureStorage.setItem(`${account.address}-auth-challenge`, account.address, {
        password,
      });
      await LocalWalletsSource.putWallet(params.wallet, password, false);
      showModal(SingleButtonModal, {
        image: 'success',
        title: t('success'),
        message: t('password changed'),
        actionLabel: t('go to profile'),
        action: () => navigateToHomeScreen({ reset: true }),
      });
    }
  };

  return (
    <StyledSafeAreaView style={styles.root} topBar={<TopBar stackProps={props} />}>
      <Typography.Title>
        {createNewPassword ? t('create a new password') : t('change your wallet password')}
      </Typography.Title>
      <View style={styles.passwordLabel}>
        <Typography.Body>
          {createNewPassword
            ? t('enter your new wallet password')
            : t('enter your old wallet password')}
        </Typography.Body>
        {createNewPassword && <PasswordComplexity score={evaluatePasswordComplexity(password)} />}
      </View>
      <SecureTextInput
        placeholder={t('password')}
        style={styles.password}
        value={password}
        onChangeText={onPasswordChange}
        autoFocus
      />
      {createNewPassword && (
        <>
          <Typography.Body style={styles.passwordComplexityHint}>
            {t('password complexity hint')}.
          </Typography.Body>
          <View style={styles.passwordLabel}>
            <Typography.Body>{t('confirm wallet password')}</Typography.Body>
          </View>
          <SecureTextInput
            placeholder={t('password')}
            style={styles.password}
            value={confirmationPassword}
            onChangeText={onConfirmationPasswordChange}
            onSubmitEditing={onContinuePressed}
          />
        </>
      )}

      <Typography.Body style={styles.errorParagraph}>{errorMessage}</Typography.Body>
      <Button
        style={styles.continueButton}
        mode="contained"
        onPress={onContinuePressed}
        disabled={createNewPassword ? !(password && confirmationPassword) : !password}
      >
        {createNewPassword ? t('confirm') : t('next')}
      </Button>
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
