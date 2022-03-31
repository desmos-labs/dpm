import { toBase64 } from '@cosmjs/encoding';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, StyledSafeAreaView, TopBar } from '../components';
import { FlexPadding } from '../components/FlexPadding';
import SecureTextInput from '../components/SecureTextInput';
import { useAppContext } from '../contexts/AppContext';
import AccountSource from '../sources/AccountSource';
import { LocalWalletsSource } from '../sources/LocalWalletsSource';
import { makeStyle } from '../theming';
import { AccountScreensStackParams } from '../types/navigation';
import * as SecureStorage from '../utilils/SecureStorage';
import LocalWallet from '../wallet/LocalWallet';
import { Typography } from '../components/typography';

type Props = StackScreenProps<AccountScreensStackParams, 'AuthorizeOperation'>;

const AuthorizeOperation: React.FC<Props> = (props) => {
  const { navigation, route } = props;
  const { address, resolve, provideWallet } = route.params;
  const styles = useStyles();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState<string>('');
  const { setAccounts } = useAppContext();

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
        const value = await SecureStorage.getItem(`${address}-auth-challenge`, {
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

  return (
    <StyledSafeAreaView topBar={<TopBar stackProps={props} title={t('wallet password')} />}>
      <Typography.Subtitle>{t('enter  wallet password')}</Typography.Subtitle>
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
      <Button mode="contained" onPress={unlockWallet} loading={loading} disabled={loading}>
        {loading ? t('unlocking') : t('confirm')}
      </Button>
      {/* <TouchableOpacity */}
      {/*    onPress={resetPassword} */}
      {/*    style={styles.forgotPasswordBtn} */}
      {/* > */}
      {/*    <Typography.Body>{t("forgot password")}</Typography.Body> */}
      {/* </TouchableOpacity> */}
    </StyledSafeAreaView>
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
