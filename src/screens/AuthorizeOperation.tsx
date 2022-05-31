import { toBase64 } from '@cosmjs/encoding';
import { useFocusEffect } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { Button, StyledSafeAreaView, TopBar } from '../components';
import BiometricsLoadingIndicator from '../components/BiometricsLoadingIndicator';
import { FlexPadding } from '../components/FlexPadding';
import SecureTextInput from '../components/SecureTextInput';
import { Typography } from '../components/typography';
import { useAppContext } from '../contexts/AppContext';
import useSettings from '../hooks/settings/useSettings';
import AccountSource from '../sources/AccountSource';
import { LocalWalletsSource } from '../sources/LocalWalletsSource';
import { makeStyle } from '../theming';
import { AccountScreensStackParams } from '../types/navigation';
import * as SecureStorage from '../utilils/SecureStorage';
import LocalWallet from '../wallet/LocalWallet';

type Props = StackScreenProps<AccountScreensStackParams, 'AuthorizeOperation'>;

const AuthorizeOperation: React.FC<Props> = (props) => {
  const { navigation, route } = props;
  const { address, resolve, provideWallet } = route.params;
  const styles = useStyles();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [loadingBiometrics, setLoadingBiometrics] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState<string>('');
  const { setAccounts } = useAppContext();
  const settings = useSettings();

  useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        if (e.data.action.type === 'GO_BACK') {
          resolve({
            authorized: false,
            wallet: null,
          });
        }
      }),
    [navigation, resolve]
  );

  const unlockWallet = useCallback(async () => {
    setLoading(true);
    try {
      let wallet: LocalWallet | null;
      if (provideWallet) {
        wallet = await LocalWalletsSource.getWallet(address, password);
      } else {
        wallet = null;
        // Get the auth challenge from the device memory
        // if is correct the value should be the user addres.
        const value = await SecureStorage.getItem('dpm_global_password', {
          password,
        });
        if (value !== null) {
          if (value !== address) {
            setError(t('invalid password'));
            return;
          }
        } else {
          // On the old version this key may not exist
          // fallback to unlock wallet to check the password
          const fallbackWallet = await LocalWalletsSource.getWallet(address, password);
          if (fallbackWallet !== null) {
            const account = await AccountSource.getAccount(address);
            // If the current chain account don't have the public key field or the
            // signAlgorithm filed update if after unlocking the wallet.
            if (
              (account && account.pubKey === undefined) ||
              (account && account.signAlgorithm === undefined)
            ) {
              const accountsData = await fallbackWallet.getAccounts();
              account.pubKey = toBase64(fallbackWallet.publicKey);
              account.signAlgorithm = accountsData[0].algo;
              await AccountSource.putAccount(account);
              const accounts = await AccountSource.getAllAccounts();
              setAccounts(accounts);
            }
          }
        }
      }
      setLoading(false);
      resolve({
        authorized: true,
        wallet,
      });
      navigation.goBack();
    } catch (e) {
      setError(t('invalid password'));
    }
    setLoading(false);
  }, [address, password, navigation, provideWallet, resolve, setAccounts, t]);

  const unlockWithBiometrics = useCallback(async () => {
    setLoadingBiometrics(true);
    try {
      const savedPassword = await SecureStorage.getItem('biometricsSignature', {
        biometrics: true,
      });
      if (savedPassword) {
        try {
          let wallet: LocalWallet | null;
          if (provideWallet) {
            wallet = await LocalWalletsSource.getWallet(address, savedPassword);
          } else {
            wallet = null;
            // Get the auth challenge from the device memory
            // if is correct the value should be the user addres.
            const value = await SecureStorage.getItem('dpm_global_password', {
              password: savedPassword,
            });
            if (value !== null) {
              if (value !== address) {
                setLoadingBiometrics(false);
                setError(t('invalid password'));
                return;
              }
            } else {
              // On the old version this key may not exist
              // fallback to unlock wallet to check the password
              const fallbackWallet = await LocalWalletsSource.getWallet(address, savedPassword);
              if (fallbackWallet !== null) {
                const account = await AccountSource.getAccount(address);
                // If the current chain account don't have the public key field or the
                // signAlgorithm filed update if after unlocking the wallet.
                if (
                  (account && account.pubKey === undefined) ||
                  (account && account.signAlgorithm === undefined)
                ) {
                  const accountsData = await fallbackWallet.getAccounts();
                  account.pubKey = toBase64(fallbackWallet.publicKey);
                  account.signAlgorithm = accountsData[0].algo;
                  await AccountSource.putAccount(account);
                  const accounts = await AccountSource.getAllAccounts();
                  setAccounts(accounts);
                }
              }
            }
          }
          setLoadingBiometrics(false);
          resolve({
            authorized: true,
            wallet,
          });
          navigation.goBack();
        } catch (e) {
          setLoadingBiometrics(false);
          setError(t('authorization with biometrics failed'));
        }
        setLoadingBiometrics(false);
      } else {
        setLoadingBiometrics(false);
        setError(t('authorization with biometrics failed'));
      }
    } catch (e) {
      setLoadingBiometrics(false);
      console.error(e);
    }
  }, [address, navigation, provideWallet, resolve, setAccounts, t]);

  useFocusEffect(
    React.useCallback(() => {
      if (settings.biometricSignature) {
        unlockWithBiometrics();
      }
    }, [settings.biometricSignature, unlockWithBiometrics])
  );

  return (
    <View>
      {loadingBiometrics && <BiometricsLoadingIndicator />}
      <StyledSafeAreaView topBar={<TopBar stackProps={props} title={t('wallet password')} />}>
        <Typography.Subtitle>{t('enter wallet password')}</Typography.Subtitle>
        <SecureTextInput
          style={styles.password}
          value={password}
          onChangeText={setPassword}
          onSubmitEditing={unlockWallet}
          placeholder={t('password')}
          autoFocus
        />
        <Typography.Body style={styles.errorMsg}>{error}</Typography.Body>
        <FlexPadding flex={1} />
        <KeyboardAvoidingView
          keyboardVerticalOffset={Platform.OS === 'ios' ? 110 : 0}
          {...(Platform.OS === 'ios' ? { behavior: 'padding' } : {})}
        >
          <Button mode="contained" onPress={unlockWallet} loading={loading} disabled={loading}>
            {loading ? t('unlocking') : t('confirm')}
          </Button>
        </KeyboardAvoidingView>
      </StyledSafeAreaView>
    </View>
  );
};

const useStyles = makeStyle((theme) => ({
  password: {
    marginTop: theme.spacing.s,
  },
  errorMsg: {
    color: theme.colors.error,
    marginTop: theme.spacing.s,
  },
  forgotPasswordBtn: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    padding: theme.spacing.s,
    marginTop: theme.spacing.s,
  },
}));

export default AuthorizeOperation;
