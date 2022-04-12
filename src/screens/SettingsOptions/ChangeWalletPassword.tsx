import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextInput, View } from 'react-native';
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
import { SettingsScreensStackParams } from '../../types/navigation';
import evaluatePasswordComplexity from '../../utilils/passwordEvaluation';
import * as SecureStorage from '../../utilils/SecureStorage';
import LocalWallet from '../../wallet/LocalWallet';

type Props = StackScreenProps<SettingsScreensStackParams>;

export default function ChangeWalletPassword(props: Props): JSX.Element {
  const { navigation, route } = props;
  const { params } = route;
  const { t } = useTranslation();
  const styles = useStyles();
  const account = useSelectedAccount();
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
    (wallet?: LocalWallet) => {
      navigation.navigate({
        name: 'CreateNewPassword',
        params: wallet ? { wallet } : {},
      });
    },
    [navigation]
  );

  const saveUserPassword = useCallback(async () => {
    await SecureStorage.setItem(`${account.address}-auth-challenge`, account.address, {
      password,
    });
    if (account.type === ChainAccountType.Local && params?.wallet) {
      await LocalWalletsSource.putWallet(params.wallet, password, false);
    }
    showModal(SingleButtonModal, {
      image: 'success',
      title: t('success'),
      message: t('password changed'),
      actionLabel: t('go to profile'),
      action: () => navigateToHomeScreen({ reset: true }),
    });
  }, [account.address, account.type, navigateToHomeScreen, params?.wallet, password, showModal, t]);

  const checkUserPassword = useCallback(async () => {
    const passwordMatch =
      account.address ===
      (await SecureStorage.getItem(`${account.address}-auth-challenge`, {
        password,
      }));
    if (passwordMatch) {
      // ChainAccountType.Local
      if (account.type === ChainAccountType.Local) {
        const decryptedWallet = await LocalWalletsSource.getWallet(account.address, password);
        navigateToCreateNewPassword(decryptedWallet);
      } else {
        // ChainAccountType.Ledger
        navigateToCreateNewPassword();
      }
    }
  }, [account.address, account.type, navigateToCreateNewPassword, password]);

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
      saveUserPassword().catch((e) => setErrorMessage(t(`failed to save password`) + e));
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
        onSubmitEditing={handleSubmit}
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
