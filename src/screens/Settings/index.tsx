import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Keychain from 'react-native-keychain';
import Flexible from 'components/Flexible';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { useSetSetting, useSetting } from '@recoil/settings';
import TopBar from 'components/TopBar';
import OpenSettingScreenButton from 'screens/Settings/components/OpenSettingScreenButton';
import { BiometricAuthorizations } from 'types/settings';
import useDeletePasswordFromBiometrics from 'hooks/useDelletPasswordFromBiometrics';
import useShowPrivacyPolicy from 'hooks/legal/useShowPrivacyPolicy';
import useShowToS from 'hooks/legal/useShowToS';
import { useToggleAnalytics, useToggleAppLock } from 'screens/Settings/hooks';
import useToggleNotifications from 'hooks/notifications/useToggleNotifications';
import { useTheme } from 'react-native-paper';
import useStyles from './useStyles';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.SETTINGS>;

/**
 * Screen that shows the settings of the app.
 * @param props
 * @constructor
 */
const Settings = (props: NavProps) => {
  const { t } = useTranslation('settings');
  const styles = useStyles();
  const theme = useTheme();

  const { navigation } = props;

  // --------------------------------------------------------------------------------------
  // --- Hooks
  // --------------------------------------------------------------------------------------

  const unlockWalletWithBiometrics = useSetting('unlockWalletWithBiometrics');
  const setUnlockWalletWalletWithBiometrics = useSetSetting('unlockWalletWithBiometrics');
  const loginWithBiometrics = useSetting('loginWithBiometrics');
  const setLoginWithBiometrics = useSetSetting('loginWithBiometrics');
  const deletePasswordFromBiometrics = useDeletePasswordFromBiometrics();
  const { toggleAnalytics, analyticsEnabled } = useToggleAnalytics();
  const { toggleNotifications, notificationsEnabled } = useToggleNotifications();
  const toggleAppLock = useToggleAppLock();

  // --------------------------------------------------------------------------------------
  // --- Local state
  // --------------------------------------------------------------------------------------

  const [biometricsSupported, setBiometricsSupported] = React.useState(false);

  // --------------------------------------------------------------------------------------
  // --- Actions
  // --------------------------------------------------------------------------------------

  const checkBiometricsSupported = useCallback(async () => {
    try {
      const supported = await Keychain.getSupportedBiometryType();
      setBiometricsSupported(supported != null);
    } catch (e) {
      setBiometricsSupported(false);
    }
  }, []);

  const handleSendFeedback = useCallback(async () => {
    Linking.openURL('mailto:development@forbole.com');
  }, []);

  const handleOpenAbout = useCallback(async () => {
    navigation.navigate(ROUTES.MARKDOWN_TEXT, {
      title: t('about dpm'),
      fileName: 'about.md',
    });
  }, [navigation, t]);

  const handleOpenPrivacy = useShowPrivacyPolicy();

  const handleOpenToS = useShowToS();

  const handleNavigateToGithub = useCallback(() => {
    Linking.openURL('https://github.com/desmos-labs/dpm');
  }, []);

  const handleEnableBiometrics = useCallback(
    async (biometricsType: BiometricAuthorizations) => {
      navigation.navigate(ROUTES.SETTINGS_ENABLE_BIOMETRICS_AUTHORIZATION, {
        biometricsType,
      });
    },
    [navigation],
  );

  const handleDisableBiometrics = useCallback(
    async (biometricsType: BiometricAuthorizations) => {
      const result = await deletePasswordFromBiometrics(biometricsType);
      if (result.isErr()) {
        // TODO: Handle the error here
        return;
      }

      switch (biometricsType) {
        case BiometricAuthorizations.Login:
          setLoginWithBiometrics(false);
          break;
        case BiometricAuthorizations.UnlockWallet:
          setUnlockWalletWalletWithBiometrics(false);
          break;
        default:
      }
    },
    [deletePasswordFromBiometrics, setLoginWithBiometrics, setUnlockWalletWalletWithBiometrics],
  );

  // --------------------------------------------------------------------------------------
  // --- Effects
  // --------------------------------------------------------------------------------------

  useEffect(() => {
    checkBiometricsSupported();
  }, [checkBiometricsSupported]);

  // --------------------------------------------------------------------------------------
  // --- Screen rendering
  // --------------------------------------------------------------------------------------

  return (
    <StyledSafeAreaView
      customBackgroundColor={theme.colors.background2}
      scrollable
      style={styles.background}
      topBar={<TopBar style={styles.topBar} stackProps={{ navigation }} title={t('settings')} />}
    >
      {/* General section */}
      <Flexible.Section title={t('general')}>
        <OpenSettingScreenButton title={t('display mode')} route={ROUTES.SETTINGS_DISPLAY_MODE} />
        <OpenSettingScreenButton title={t('switch chain')} route={ROUTES.SETTINGS_SWITCH_CHAIN} />
        {__DEV__ && (
          <Flexible.SectionSwitch
            label={t('notifications')}
            value={notificationsEnabled}
            isDisabled={false}
            onPress={toggleNotifications}
          />
        )}
        <Flexible.SectionSwitch
          label={t('analytics')}
          value={analyticsEnabled}
          isDisabled={false}
          onPress={toggleAnalytics}
        />
      </Flexible.Section>

      {/* Security section */}
      <Flexible.Section style={styles.sectionMargin} title={t('security')}>
        <Flexible.SectionButton label={t('disable app lock')} onPress={toggleAppLock} />
        <OpenSettingScreenButton
          title={t('change application password')}
          route={ROUTES.SETTINGS_CHANGE_APPLICATION_PASSWORD}
        />
        <Flexible.SectionSwitch
          label={t('enable face id for signature')}
          value={unlockWalletWithBiometrics}
          isDisabled={!biometricsSupported}
          onPress={
            unlockWalletWithBiometrics
              ? () => handleDisableBiometrics(BiometricAuthorizations.UnlockWallet)
              : () => handleEnableBiometrics(BiometricAuthorizations.UnlockWallet)
          }
        />
        <Flexible.SectionSwitch
          label={t('enable face id for login')}
          value={loginWithBiometrics}
          isDisabled={!biometricsSupported}
          onPress={
            loginWithBiometrics
              ? () => handleDisableBiometrics(BiometricAuthorizations.Login)
              : () => handleEnableBiometrics(BiometricAuthorizations.Login)
          }
        />
      </Flexible.Section>

      {/* Support section */}
      <Flexible.Section style={styles.sectionMargin} title={t('support')}>
        <Flexible.SectionButton label={t('feedback')} onPress={handleSendFeedback} />
        <OpenSettingScreenButton
          title={t('join community')}
          route={ROUTES.SETTINGS_JOIN_COMMUNITY}
        />
      </Flexible.Section>

      {/* About section */}
      <Flexible.Section style={styles.sectionMargin} title={t('about')}>
        <Flexible.SectionButton label={t('about dpm')} onPress={handleOpenAbout} />
        <Flexible.SectionButton label={t('legal:privacy policy')} onPress={handleOpenPrivacy} />
        <Flexible.SectionButton label={t('legal:terms of service')} onPress={handleOpenToS} />
        <Flexible.SectionButton label={t('open source')} onPress={handleNavigateToGithub} />
        <Flexible.SectionText label={t('version')} value={DeviceInfo.getVersion()} />
      </Flexible.Section>
    </StyledSafeAreaView>
  );
};

export default Settings;
