import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import * as Keychain from 'react-native-keychain';
import SecureTextInput from 'components/SecureTextInput';
import useSetSettings from '../../../hooks/settings/useSetSettings';
import useSettings from '../../../hooks/settings/useSettings';
import * as SecureStorage from '../../../utilils/SecureStorage';
import { Button, StyledSafeAreaView, TopBar , FlexPadding } from '../../../components';
import { Typography } from '../../../components/Typography';
import { makeStyle } from '../../../theming';
import { SettingsScreensStackParams } from '../../../types/navigation';

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
      <FlexPadding flex={1} />
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

const useStyles = makeStyle((theme) => ({
  root: {
    paddingTop: 0,
  },
  button: {
    marginTop: theme.spacing.m,
  },
  password: {
    marginTop: theme.spacing.s,
  },
  errorMsg: {
    color: theme.colors.error,
    marginTop: theme.spacing.s,
  },
}));

export default HandleBiometrics;
