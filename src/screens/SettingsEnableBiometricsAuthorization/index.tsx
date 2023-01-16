import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform } from 'react-native';
import SecureTextInput from 'components/SecureTextInput';
import Typography from 'components/Typography';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import Flexible from 'components/Flexible';
import Button from 'components/Button';
import { useSetSettings } from '@recoil/settings';
import { BiometricAuthorizations } from 'types/settings';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import * as SecureSettings from 'lib/SecureStorage';
import useStyles from './useStyles';

export interface EnableBiometricsAuthorizationParams {
  readonly biometricsType: BiometricAuthorizations;
}

type Props = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.SETTINGS_ENABLE_BIOMETRICS_AUTHORIZATION
>;

const SettingsEnableBiometricsAuthorization: React.FC<Props> = (props) => {
  const { navigation, route } = props;
  const {
    params: { biometricsType },
  } = route;
  const [password, setPassword] = React.useState<string>('');
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const { t } = useTranslation();
  const styles = useStyles();
  const setSettings = useSetSettings();

  const btnAction = useCallback(
    async (inputPassword: string) => {
      setLoading(true);
      const passwordValid = await SecureSettings.checkUserPassword(inputPassword);
      if (passwordValid) {
        // Store the password using the biometrics.
        await SecureSettings.storeBiometricAuthorization(biometricsType, inputPassword);

        // Update the app settings
        setSettings((currentSettings) => {
          if (biometricsType === BiometricAuthorizations.Login) {
            return {
              ...currentSettings,
              loginWithBiometrics: true,
            };
          }
          if (biometricsType === BiometricAuthorizations.UnlockWallet) {
            return {
              ...currentSettings,
              unlockWalletWithBiometrics: true,
            };
          }
          return currentSettings;
        });
        navigation.goBack();
      } else {
        setError(t('wrong confirmation password'));
      }
      setLoading(false);
    },
    [biometricsType, navigation, setSettings, t],
  );

  return (
    <StyledSafeAreaView style={styles.root} topBar={<TopBar stackProps={props} />}>
      <Typography.Title>
        {biometricsType === BiometricAuthorizations.Login
          ? t('enable biometrics for login')
          : t('enable biometrics for signature')}
      </Typography.Title>
      <Typography.Body>{t('insert your password to enable biometrics')}</Typography.Body>
      <SecureTextInput
        style={styles.password}
        value={password}
        onChangeText={setPassword}
        onSubmitEditing={() => btnAction(password)}
        onTextInput={() => setError(t(''))}
        placeholder={t('password')}
        autoFocus
      />
      <Typography.Body style={styles.errorMsg}>{error}</Typography.Body>
      <Flexible.Padding flex={1} />
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS === 'ios' ? 110 : 0}
        {...(Platform.OS === 'ios' ? { behavior: 'padding' } : {})}
      >
        <Button
          style={styles.button}
          mode="contained"
          loading={loading}
          disabled={loading}
          onPress={() => btnAction(password)}
        >
          {loading ? t('loading') : t('enable')}
        </Button>
      </KeyboardAvoidingView>
    </StyledSafeAreaView>
  );
};

export default SettingsEnableBiometricsAuthorization;
