import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
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
import { useSetting } from '@recoil/settings';
import { BiometricAuthorizations } from 'types/settings';
import useGetPasswordFromBiometrics from 'hooks/useGetPasswordFromBiometrics';
import { isInvalidPasswordError } from 'lib/SecureStorage/errors';
import Spacer from 'components/Spacer';
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

/**
 * Screen that allows the user to unlock their wallet.
 * @constructor
 */
const UnlockWallet: React.FC<Props> = (props) => {
  const styles = useStyles();
  const { t } = useTranslation('account');

  const { route } = props;
  const { params } = route;
  const { onSuccess, address, onCancel, signingMode } = params;

  // --------------------------------------------------------------------------------------
  // --- Hooks
  // --------------------------------------------------------------------------------------

  const unlockWalletWithPassword = useUnlockWalletWithPassword();
  const unlockWithBiometrics = useSetting('unlockWalletWithBiometrics');
  const getPasswordFromBiometrics = useGetPasswordFromBiometrics(
    BiometricAuthorizations.UnlockWallet,
  );

  // Cancel if the user close this screen.
  useOnBackAction(() => onCancel !== undefined && onCancel(), [onCancel]);

  // --------------------------------------------------------------------------------------
  // --- Local state
  // --------------------------------------------------------------------------------------

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [inputPassword, setInputInputPassword] = useState('');

  // --------------------------------------------------------------------------------------
  // --- Actions
  // --------------------------------------------------------------------------------------

  // Callback called when the user press the unlock button
  const unlockWallet = useCallback(
    async (unlockWalletPassword: string | undefined) => {
      if (!unlockWalletPassword) return;

      setLoading(true);

      // Unlock the wallet
      const result = await unlockWalletWithPassword(address, unlockWalletPassword, signingMode);
      if (result.isErr()) {
        if (isInvalidPasswordError(result.error)) {
          setError(t('account:wrong password'));
        } else {
          setError((result.error as Error).message);
        }
      } else {
        const { value: wallet } = result;
        if (wallet) {
          // Connect the signer to be able to use the wallet
          await wallet.signer.connect();
          onSuccess(wallet);
        }
      }
      setLoading(false);
    },
    [unlockWalletWithPassword, address, signingMode, onSuccess, t],
  );

  const unlockWalletWithBiometrics = useCallback(async () => {
    const biometricPassword = await getPasswordFromBiometrics();
    // User cancel the biometric unlock procedure.
    if (biometricPassword === undefined) {
      setLoading(false);
      return;
    }
    await unlockWallet(biometricPassword);
  }, [getPasswordFromBiometrics, unlockWallet]);

  const unlockWalletWithWithPassword = useCallback(async () => {
    await unlockWallet(inputPassword);
  }, [unlockWallet, inputPassword]);

  // --------------------------------------------------------------------------------------
  // --- Effects
  // --------------------------------------------------------------------------------------

  useEffect(() => {
    if (unlockWithBiometrics) {
      setLoading(true);
      // Use a timeout to allow the application to show the screen
      // before displaying the os biometrics modal.
      setTimeout(unlockWalletWithBiometrics, 500);
    }

    // It's fine to disable the exhaustive deps check here because we only want to run this effect only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --------------------------------------------------------------------------------------
  // --- Screen rendering
  // --------------------------------------------------------------------------------------

  return (
    <View style={styles.root}>
      <StyledSafeAreaView
        topBar={<TopBar stackProps={props} title={t('wallet password')} />}
        touchableWithoutFeedbackDisabled={false}
      >
        <Typography.Subtitle>{t('enter wallet password')}</Typography.Subtitle>
        <SecureTextInput
          style={styles.password}
          value={inputPassword}
          onChangeText={setInputInputPassword}
          placeholder={t('common:password')}
          autoFocus={!unlockWithBiometrics}
          onSubmitEditing={unlockWalletWithWithPassword}
        />
        {unlockWithBiometrics && (
          <>
            <Spacer paddingVertical={8} />
            <Button mode="text" onPress={unlockWalletWithBiometrics} disabled={loading}>
              {t('common:use biometrics')}
            </Button>
          </>
        )}
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
            {loading ? t('unlocking') : t('common:confirm')}
          </Button>
        </KeyboardAvoidingView>
      </StyledSafeAreaView>
    </View>
  );
};

export default UnlockWallet;
