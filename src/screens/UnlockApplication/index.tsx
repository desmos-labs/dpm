import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Padding from 'components/Flexible/Padding';
import SecureTextInput from 'components/SecureTextInput';
import Typography from 'components/Typography';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import Button from 'components/Button';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { useSetting } from '@recoil/settings';
import { checkUserPassword, isKeyChainInitialized } from 'lib/SecureStorage';
import { BiometricAuthorizations } from 'types/settings';
import { useSetAppState } from '@recoil/appState';
import useGetPasswordFromBiometrics from 'hooks/useGetPasswordFromBiometrics';
import Spacer from 'components/Spacer';
import DKeyboardAvoidingView from 'components/DKeyboardAvoidingView';
import useResetToHomeScreen from 'hooks/navigation/useResetToHomeScreen';
import useStyles from './useStyles';

// Development related
const ALLOWED_NAVIGATION_ACTIONS = ['RESET', 'NAVIGATE'];

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.UNLOCK_APPLICATION>;

/**
 * Screen that allows the user to unlock the application.
 * @constructor
 */
const UnlockApplication: React.FC<NavProps> = (props) => {
  const { navigation } = props;
  const { t } = useTranslation('account');
  const styles = useStyles();
  const resetToHome = useResetToHomeScreen();

  // --------------------------------------------------------------------------------------
  // --- Hooks
  // --------------------------------------------------------------------------------------

  const areBiometricsEnabled = useSetting('loginWithBiometrics');
  const setAppState = useSetAppState();

  const getPasswordFromBiometrics = useGetPasswordFromBiometrics(BiometricAuthorizations.Login);

  const previousScreenParams = useMemo(() => {
    const { routes } = navigation.getState();
    if (routes.length <= 1) {
      return undefined;
    }
    const currentRoute = routes[routes.length - 2];
    return { key: currentRoute.key, params: currentRoute.params };
  }, [navigation]);

  // --------------------------------------------------------------------------------------
  // --- Local state
  // --------------------------------------------------------------------------------------

  const [loading, setLoading] = useState(false);
  const [inputPassword, setInputPassword] = useState('');
  const [error, setError] = useState<string>();

  // --------------------------------------------------------------------------------------
  // --- Effects
  // --------------------------------------------------------------------------------------

  // Prevent to exit from this screen.
  useEffect(() => {
    const listener = (e: any) => {
      if (!__DEV__ && ALLOWED_NAVIGATION_ACTIONS.indexOf(e.data.action.type) === -1) {
        e.preventDefault();
      } else {
        // Give time to the application to close the screen
        // before marking it as unlocked.
        setTimeout(() => {
          // Unlock the application
          setAppState((currentState) => ({
            ...currentState,
            locked: false,
            noLockOnBackground: false,
          }));
        }, 200);
      }
    };

    return navigation.addListener('beforeRemove', listener);
  }, [navigation, setAppState]);

  // Use the biometrics authentication if the user has enabled it
  useEffect(() => {
    (async () => {
      const keyChainInitialized = await isKeyChainInitialized();
      if (keyChainInitialized && areBiometricsEnabled) {
        setLoading(true);
        setTimeout(unlockWithBiometrics, 500);
      }
    })();
    // eslint-disable-next-line
  }, []);

  // --------------------------------------------------------------------------------------
  // --- Actions
  // --------------------------------------------------------------------------------------

  const unlockApplication = useCallback(
    async (password: string | undefined) => {
      if (!password) return;

      setLoading(true);

      const passwordOk = await checkUserPassword(password);
      if (!passwordOk) {
        setError(t('account:wrong password'));
      } else if (previousScreenParams !== undefined) {
        // Go to the previous screen.
        navigation.navigate(previousScreenParams);
      } else {
        // Reset to home screen.
        resetToHome();
      }
      setLoading(false);
    },
    [navigation, previousScreenParams, resetToHome, t],
  );

  const unlockWithBiometrics = useCallback(async () => {
    const biometricPassword = await getPasswordFromBiometrics();
    // User cancel the unlock procedure.
    if (biometricPassword === undefined) {
      setLoading(false);
      return;
    }

    unlockApplication(biometricPassword);
  }, [getPasswordFromBiometrics, unlockApplication]);

  const unlockWithPassword = useCallback(() => {
    unlockApplication(inputPassword);
  }, [inputPassword, unlockApplication]);

  // --------------------------------------------------------------------------------------
  // --- Screen rendering
  // --------------------------------------------------------------------------------------

  return (
    <StyledSafeAreaView
      topBar={<TopBar stackProps={props} hideGoBack={true} title={t('unlock application')} />}
      touchableWithoutFeedbackDisabled={false}
    >
      <Spacer paddingVertical={8} />
      <Typography.Subtitle>{t('enter security password')}</Typography.Subtitle>
      <SecureTextInput
        style={styles.password}
        value={inputPassword}
        onChangeText={setInputPassword}
        onSubmitEditing={unlockWithPassword}
        placeholder={t('common:password')}
        autoFocus={!areBiometricsEnabled}
      />
      {areBiometricsEnabled && (
        <>
          <Spacer paddingVertical={8} />
          <Button mode="text" onPress={unlockWithBiometrics} disabled={loading}>
            {t('common:use biometrics')}
          </Button>
        </>
      )}
      <Typography.Body style={styles.errorMsg}>{error}</Typography.Body>
      <Padding flex={1} />
      <DKeyboardAvoidingView>
        <Button mode="contained" onPress={unlockWithPassword} loading={loading} disabled={loading}>
          {loading ? t('common:loading') : t('common:confirm')}
        </Button>
      </DKeyboardAvoidingView>
    </StyledSafeAreaView>
  );
};

export default UnlockApplication;
