import { CompositeScreenProps, useFocusEffect } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button, StyledSafeAreaView, TopBar } from '../components';
import BiometricsLoadingIndicator from '../components/BiometricsLoadingIndicator';
import { FlexPadding } from '../components/FlexPadding';
import SecureTextInput from '../components/SecureTextInput';
import { Typography } from '../components/typography';
import { useAppContext } from '../contexts/AppContext';
import useSetSettings from '../hooks/settings/useSetSettings';
import useSettings from '../hooks/settings/useSettings';
import useNavigateToHomeScreen from '../hooks/useNavigateToHomeScreen';
import useShowModal from '../hooks/useShowModal';
import { TwoButtonModal } from '../modals/TwoButtonModal';
import AccountSource from '../sources/AccountSource';
import { LocalWalletsSource } from '../sources/LocalWalletsSource';
import ProfileSource from '../sources/ProfileSource';
import { makeStyle } from '../theming';
import { AccountScreensStackParams, RootStackParams } from '../types/navigation';
import { DefaultAppSettings } from '../types/settings';
import * as SecureStorage from '../utilils/SecureStorage';

export type Props = CompositeScreenProps<
  StackScreenProps<RootStackParams, 'UnlockApplication'>,
  StackScreenProps<AccountScreensStackParams>
>;

const UnlockApplication: React.FC<Props> = (props) => {
  const { route, navigation } = props;
  const oldRoute = route.params?.oldRoute;
  const oldState = route.params?.oldState;
  const styles = useStyles();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [loadingBiometrics, setLoadingBiometrics] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState<string>('');
  const navigateToHomeScreen = useNavigateToHomeScreen();
  const openModal = useShowModal();
  const { setProfiles, setAccounts, setSelectedAccount, setChainLinks } = useAppContext();
  const settings = useSettings();
  const setSettings = useSetSettings();
  const inputRef = useRef<TextInput>(null);

  const unloadContext = useCallback(() => {
    // Wipe the app context
    setAccounts([]);
    setProfiles({});
    setSelectedAccount(null);
    setChainLinks({});
  }, [setAccounts, setChainLinks, setProfiles, setSelectedAccount]);

  const resetApplication = useCallback(async () => {
    // Wipe the application storage and the cache
    await AccountSource.reset();
    await LocalWalletsSource.reset();
    await ProfileSource.reset();
    await SecureStorage.resetSecureStorage();
    setSettings(DefaultAppSettings);
    unloadContext();

    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'AccountCreationScreens',
        },
      ],
    });
  }, [navigation, setSettings, unloadContext]);

  const openResetModal = useCallback(() => {
    openModal(TwoButtonModal, {
      title: t('forgot password'),
      message: t('reset password informations'),
      positiveActionLabel: t('confirm'),
      negativeActionLabel: t('cancel'),
      positiveAction: () => resetApplication(),
      negativeAction: () => navigation.goBack(),
    });
  }, [navigation, openModal, resetApplication, t]);

  const navigateToCorrectScreen = useCallback(() => {
    if (oldRoute) {
      navigation.reset({
        index: 0,
        routes: oldState.routes,
        key: route.key,
      });
    } else {
      Keyboard.dismiss();
      navigateToHomeScreen({ reset: true });
    }
  }, [navigateToHomeScreen, navigation, oldRoute, oldState, route.key]);

  const unlockWallet = useCallback(async () => {
    Keyboard.dismiss();
    setLoading(true);
    try {
      // Get the auth challenge from the device memory
      // if is correct the value should be the user address.
      const value = await SecureStorage.getItem('dpm_global_password', {
        password,
      });
      if (value === 'dpm_global_password') {
        navigateToCorrectScreen();
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      setError(t('invalid password'));
    }
  }, [navigateToCorrectScreen, password, t]);

  const unlockWithBiometrics = useCallback(async () => {
    setLoadingBiometrics(true);
    setTimeout(async () => {
      try {
        const savedPassword = await SecureStorage.getItem('biometricsLogin', {
          biometrics: true,
        });
        if (savedPassword) {
          const stringToCheck = await SecureStorage.getItem('dpm_global_password', {
            password: savedPassword,
          });
          if (stringToCheck === 'dpm_global_password') {
            setTimeout(() => {
              navigateToCorrectScreen();
              setLoadingBiometrics(false);
            }, 500);
          }
        }
      } catch (e) {
        setLoadingBiometrics(false);
        setError(t('authorization with biometrics failed'));
      }
    }, 500);
  }, [navigateToCorrectScreen, t]);

  useFocusEffect(
    React.useCallback(() => {
      if (settings.biometricLogin) {
        unlockWithBiometrics();
      }
    }, [settings.biometricLogin, unlockWithBiometrics])
  );

  return (
    <View style={{ flex: 1 }}>
      {loadingBiometrics && <BiometricsLoadingIndicator />}
      <StyledSafeAreaView topBar={<TopBar stackProps={props} />}>
        <Typography.Subtitle>{t('enter security password')}</Typography.Subtitle>
        <SecureTextInput
          style={styles.password}
          value={password}
          onChangeText={setPassword}
          onSubmitEditing={unlockWallet}
          onTextInput={() => setError(t(''))}
          onResponderStart={() => setError(t(''))}
          placeholder={t('password')}
          inputRef={inputRef}
          clearTextOnFocus
        />
        <Typography.Body style={styles.errorMsg}>{error}</Typography.Body>
        <FlexPadding flex={1} />
        <KeyboardAvoidingView
          keyboardVerticalOffset={Platform.OS === 'ios' ? 70 : 0}
          {...(Platform.OS === 'ios' ? { behavior: 'padding' } : {})}
        >
          <Button mode="contained" onPress={unlockWallet}>
            {loading ? t('loading') : t('confirm')}
          </Button>
          <TouchableOpacity style={styles.forgotPasswordBtn} onPress={() => openResetModal()}>
            <Text style={styles.labelStyle}>{t('forgot password')}?</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </StyledSafeAreaView>
    </View>
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
  },
  labelStyle: {
    fontFamily: 'Poppins-Medium',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0.0125,
    color: theme.colors.font['1'],
  },
}));

export default UnlockApplication;
