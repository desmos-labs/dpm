import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useState } from 'react';
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
import useStyles from './useStyles';

export interface UnlockWalletParams {
  /**
   * Function called if the user correctly unlocks the wallet.
   */
  readonly onSuccess: (wallet: Wallet) => any;
  /**
   * Optional address of the wallet to unlock.
   * If undefined will be used the current active account address.
   */
  readonly address: string;
  /**
   * Callback called if the user cancel the procedure.
   */
  readonly onCancel?: () => any;
}

type Props = StackScreenProps<RootNavigatorParamList, ROUTES.UNLOCK_WALLET>;

const UnlockWallet: React.FC<Props> = (props) => {
  const { onSuccess, address, onCancel } = props.route.params;
  const styles = useStyles();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [loadingBiometrics] = useState(false);
  const [error, setError] = useState<string>();
  const [password, setPassword] = useState<string>('');
  const unlockWalletWithPassword = useUnlockWalletWithPassword();

  // Cancel if the user close this screen.
  useOnBackAction(() => onCancel !== undefined && onCancel(), [onCancel]);

  const unlockWallet = useCallback(async () => {
    try {
      setLoading(true);
      setError(undefined);
      const wallet = await unlockWalletWithPassword(address, password);

      if (wallet !== undefined) {
        await wallet.signer.connect();
        onSuccess(wallet);
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
  }, [unlockWalletWithPassword, address, password, onSuccess, t]);

  return (
    <View style={styles.root}>
      {loadingBiometrics && <BiometricsLoadingIndicator />}
      <StyledSafeAreaView topBar={<TopBar stackProps={props} title={t('wallet password')} />}>
        <Typography.Subtitle>{t('enter wallet password')}</Typography.Subtitle>
        <SecureTextInput
          style={styles.password}
          value={password}
          onChangeText={setPassword}
          placeholder={t('password')}
          autoFocus
          onSubmitEditing={unlockWallet}
        />
        <Typography.Body style={styles.errorMsg}>{error}</Typography.Body>
        <Padding flex={1} />
        <KeyboardAvoidingView
          keyboardVerticalOffset={Platform.OS === 'ios' ? 110 : 0}
          {...(Platform.OS === 'ios' ? { behavior: 'padding' } : {})}
        >
          <Button mode="contained" loading={loading} disabled={loading} onPress={unlockWallet}>
            {loading ? t('unlocking') : t('confirm')}
          </Button>
        </KeyboardAvoidingView>
      </StyledSafeAreaView>
    </View>
  );
};

export default UnlockWallet;
