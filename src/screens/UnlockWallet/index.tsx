import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import BiometricsLoadingIndicator from 'components/BiometricsLoadingIndicator';
import Padding from 'components/Flexible/Padding';
import SecureTextInput from 'components/SecureTextInput';
import Typography from 'components/Typography';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import Button from 'components/Button';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { Wallet } from 'types/wallet';
import useOnBackAction from 'hooks/useOnBackAction';
import { useUnlockWalletWithPassword } from 'screens/UnlockWallet/useHooks';
import { SigningMode } from '@desmoslabs/desmjs';
import { useSettings } from '@recoil/settings';
import * as SecureStorage from 'lib/SecureStorage';
import { BiometricAuthorizations } from 'types/settings';
import useStyles from './useStyles';

export interface UnlockWalletParams {
  /**
   * Function called if the user correctly unlocks the wallet.
   */
  readonly onSuccess: (wallet: Wallet) => any;
  /**
   * Address of the wallet to unlock.
   */
  readonly address: string;
  /**
   * Wallet signing mode
   */
  readonly signingMode?: SigningMode;
  /**
   * Callback called if the user cancel the procedure.
   */
  readonly onCancel?: () => any;
}

type Props = StackScreenProps<RootNavigatorParamList, ROUTES.UNLOCK_WALLET>;

const UnlockWallet: React.FC<Props> = (props) => {
  const { onSuccess, address, onCancel, signingMode } = props.route.params;
  const styles = useStyles();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [loadingBiometrics] = useState(false);
  const [error, setError] = useState<string>();
  const [inputPassword, setInputInputPassword] = useState('');
  const unlockWalletWithPassword = useUnlockWalletWithPassword();
  const appSettings = useSettings();

  // Cancel if the user close this screen.
  useOnBackAction(() => onCancel !== undefined && onCancel(), [onCancel]);

  const unlockWallet = useCallback(
    async (unlockWalletPassword: string | undefined) => {
      setLoading(true);
      try {
        setError(undefined);
        if (unlockWalletPassword !== undefined) {
          const wallet = await unlockWalletWithPassword(address, unlockWalletPassword, signingMode);
          if (wallet !== undefined) {
            await wallet.signer.connect();
            onSuccess(wallet);
          }
        }
      } catch (e) {
        if (e.message.indexOf('BAD_DECRYPT') !== 0) {
          setError(t('wrong password'));
        } else {
          setError(e.message);
        }
      } finally {
        setLoading(false);
      }
    },
    [unlockWalletWithPassword, address, signingMode, onSuccess, t],
  );

  const unlockWalletWithBiometrics = useCallback(async () => {
    const biometricPassword = await SecureStorage.getBiometricPassword(
      BiometricAuthorizations.UnlockWallet,
    );
    await unlockWallet(biometricPassword);
  }, [unlockWallet]);

  const unlockWalletWithWithPassword = useCallback(async () => {
    await unlockWallet(inputPassword);
  }, [unlockWallet, inputPassword]);

  useEffect(() => {
    if (appSettings.unlockWalletWithBiometrics) {
      setLoading(true);
      // Use a timeout to allow the application to show the screen
      // before displaying the os biometrics modal.
      setTimeout(unlockWalletWithBiometrics, 500);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.root}>
      {loadingBiometrics && <BiometricsLoadingIndicator />}
      <StyledSafeAreaView topBar={<TopBar stackProps={props} title={t('wallet password')} />}>
        <Typography.Subtitle>{t('enter wallet password')}</Typography.Subtitle>
        <SecureTextInput
          style={styles.password}
          value={inputPassword}
          onChangeText={setInputInputPassword}
          placeholder={t('password')}
          autoFocus={!appSettings.unlockWalletWithBiometrics}
          onSubmitEditing={unlockWalletWithWithPassword}
        />
        <Typography.Body style={styles.errorMsg}>{error}</Typography.Body>
        <Padding flex={1} />
        <KeyboardAvoidingView
          keyboardVerticalOffset={Platform.OS === 'ios' ? 110 : 0}
          {...(Platform.OS === 'ios' ? { behavior: 'padding' } : {})}
        >
          <Button
            mode="contained"
            loading={loading}
            disabled={loading}
            onPress={unlockWalletWithWithPassword}
          >
            {loading ? t('unlocking') : t('confirm')}
          </Button>
        </KeyboardAvoidingView>
      </StyledSafeAreaView>
    </View>
  );
};

export default UnlockWallet;
