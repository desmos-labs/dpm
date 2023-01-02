import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import * as Keychain from 'react-native-keychain';
import SecureTextInput from 'components/SecureTextInput';
import useSetSettings from 'hooks/settings/useSetSettings';
import useSettings from 'hooks/settings/useSettings';
import Typography from 'components/Typography';
import { SettingsScreensStackParams } from 'types/navigation';
import * as SecureStorage from 'lib/SecureStorage';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import Flexible from 'components/Flexible';
import Button from 'components/Button';
import useStyles from './useStyles';

type Props = StackScreenProps<SettingsScreensStackParams, 'HandleBiometrics'>;

const HandleBiometrics: React.FC<Props> = (props) => {
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
  const settings = useSettings();

  const btnAction = useCallback(
    async (inputPassword: string) => {
      setLoading(true);
      Keyboard.dismiss();
      try {
        const isSupported = await Keychain.getSupportedBiometryType();
        if (!isSupported) {
          setLoading(false);
          return;
        }
        if (inputPassword) {
          const stringToCheck = await SecureStorage.getItem('dpm_global_password', {
            password: inputPassword,
          });
          if (stringToCheck === 'dpm_global_password') {
            await SecureStorage.setItem(biometricsType, inputPassword, { biometrics: true });
            if (biometricsType === 'biometricsLogin') {
              setSettings({ biometricLogin: !settings.biometricLogin });
            } else {
              setSettings({ biometricSignature: !settings.biometricSignature });
            }
            setLoading(false);
            navigation.goBack();
          }
        }
      } catch (e) {
        setLoading(false);
        setError(t('invalid password'));
      }
    },
    [
      biometricsType,
      navigation,
      setSettings,
      settings.biometricLogin,
      settings.biometricSignature,
      t,
    ],
  );

  return (
    <StyledSafeAreaView style={styles.root} topBar={<TopBar stackProps={props} />}>
      <Typography.Title>
        {biometricsType === 'biometricsLogin'
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
        <Button style={styles.button} mode="contained" onPress={() => btnAction(password)}>
          {loading ? t('loading') : t('enable')}
        </Button>
      </KeyboardAvoidingView>
    </StyledSafeAreaView>
  );
};



export default HandleBiometrics;
