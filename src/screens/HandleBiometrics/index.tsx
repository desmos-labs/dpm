import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import SecureTextInput from 'components/SecureTextInput';
import Typography from 'components/Typography';
import { SettingsScreensStackParams } from 'types/navigation';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import Flexible from 'components/Flexible';
import Button from 'components/Button';
import { useRecoilState } from 'recoil';
import appSettingsState from '@recoil/settings';
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
  const [setSettings] = useRecoilState(appSettingsState);

  const btnAction = useCallback(
    async (_inputPassword: string) => {
      setLoading(true);
      Keyboard.dismiss();
      setLoading(false);
    },
    [
      biometricsType,
      navigation,
      setSettings,
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
