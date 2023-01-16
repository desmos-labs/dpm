import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform } from 'react-native';
import Padding from 'components/Flexible/Padding';
import SecureTextInput from 'components/SecureTextInput';
import Typography from 'components/Typography';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import Button from 'components/Button';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { useSettings } from '@recoil/settings';
import { checkUserPassword, getBiometricPassword } from 'lib/SecureStorage';
import { BiometricAuthorizations } from 'types/settings';
import { useSetAppState } from '@recoil/appState';
import useStyles from './useStyles';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.UNLOCK_APPLICATION>;
const ALLOWED_NAVIGATION_ACTIONS = ['RESET', 'NAVIGATE'];

const UnlockApplication: React.FC<NavProps> = (props) => {
  const { navigation } = props;
  const styles = useStyles();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [inputPassword, setInputPassword] = useState('');
  const [error, setError] = useState<string>();
  const settings = useSettings();
  const setAppState = useSetAppState();

  // Prevent to exit from this screen.
  useEffect(() => {
    const listener = (e: any) => {
      if (!__DEV__ && ALLOWED_NAVIGATION_ACTIONS.indexOf(e.data.action.type) === -1) {
        e.preventDefault();
      } else {
        // Unlock the application
        setAppState({
          locked: false,
        });
      }
    };

    navigation.addListener('beforeRemove', listener);
    return () => {
      navigation.removeListener('beforeRemove', listener);
    };
  }, [navigation, setAppState]);

  const previousScreenParams = useMemo(() => {
    const { routes } = navigation.getState();
    if (routes.length <= 1) {
      return undefined;
    }
    const currentRoute = routes[routes.length - 2];
    return { key: currentRoute.key, params: currentRoute.params };
  }, [navigation]);

  const unlockApplication = useCallback(
    async (password: string | undefined) => {
      setLoading(true);
      try {
        if (password !== undefined) {
          const passwordOk = await checkUserPassword(password);
          if (!passwordOk) {
            setError(t('invalid password'));
          } else if (previousScreenParams !== undefined) {
            // Go to the previous screen.
            navigation.navigate(previousScreenParams);
          } else {
            // Reset to home screen.
            navigation.reset({
              index: 0,
              routes: [{ name: ROUTES.HOME_TABS }],
            });
          }
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    },
    [navigation, previousScreenParams, t],
  );

  const unlockWithBiometrics = useCallback(async () => {
    const biometricPassword = await getBiometricPassword(BiometricAuthorizations.Login);
    unlockApplication(biometricPassword);
  }, [unlockApplication]);

  const unlockWithPassword = useCallback(() => {
    unlockApplication(inputPassword);
  }, [inputPassword, unlockApplication]);

  useEffect(() => {
    if (settings.loginWithBiometrics) {
      setLoading(true);
      setTimeout(unlockWithBiometrics, 500);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <StyledSafeAreaView
      topBar={<TopBar stackProps={props} hideGoBack={true} title={t('unlock application')} />}
      divider
    >
      <Typography.Subtitle>{t('enter security password')}</Typography.Subtitle>
      <SecureTextInput
        style={styles.password}
        value={inputPassword}
        onChangeText={setInputPassword}
        onSubmitEditing={unlockWithPassword}
        placeholder={t('password')}
      />
      <Typography.Body style={styles.errorMsg}>{error}</Typography.Body>
      <Padding flex={1} />
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS === 'ios' ? 70 : 0}
        {...(Platform.OS === 'ios' ? { behavior: 'padding' } : {})}
      >
        <Button mode="contained" onPress={unlockWithPassword} loading={loading} disabled={loading}>
          {loading ? t('loading') : t('confirm')}
        </Button>
      </KeyboardAvoidingView>
    </StyledSafeAreaView>
  );
};

export default UnlockApplication;
