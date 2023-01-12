import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Keychain from 'react-native-keychain';
import Flexible from 'components/Flexible';
import * as SecureStorage from 'lib/SecureStorage';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { useSetSettings, useSettings } from '@recoil/settings';
import TopBar from 'components/TopBar';
import OpenSettingScreenButton from 'screens/Settings/components/OpenSettingScreenButton';
import useStyles from './useStyles';

export type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.SETTINGS>;

const Settings = (props: NavProps) => {
  const { navigation } = props;
  const { t } = useTranslation('settings');
  const styles = useStyles();

  const settings = useSettings();
  const setSettings = useSetSettings();
  const [biometricsSupported, setBiometricsSupported] = React.useState<boolean>(false);

  const sendFeedback = useCallback(async () => {
    Linking.openURL('mailto:development@forbole.com').catch((err) =>
      console.error("Couldn't open email application", err),
    );
  }, []);

  const openAbout = useCallback(async () => {
    navigation.navigate(ROUTES.MARKDOWN_TEXT, {
      title: t('about dpm'),
      fileName: 'about.md',
    });
  }, [navigation, t]);

  const openPrivacy = useCallback(async () => {
    navigation.navigate(ROUTES.MARKDOWN_TEXT, {
      title: t('privacy policy'),
      fileName: 'privacy.md',
    });
  }, [navigation, t]);

  const navigateToGithub = useCallback(() => {
    Linking.openURL('https://github.com/desmos-labs/dpm').catch((err) =>
      console.error("Couldn't load page", err),
    );
  }, []);

  const navigateHandleBiometrics = useCallback(
    async (biometricsType: 'biometricsLogin' | 'biometricsSignature') => {
      // navigation.navigate({
      //   name: 'HandleBiometrics',
      //   params: { biometricsType },
      // });
    },
    [navigation],
  );

  const turnOffBiometrics = useCallback(
    async (biometricsType: 'biometricsLogin' | 'biometricsSignature') => {
      const savedPassword = await SecureStorage.getItem<string>(biometricsType, {
        biometrics: true,
      });
      if (savedPassword) {
        const stringToCheck = await SecureStorage.getItem<string>('dpm_global_password', {
          password: savedPassword,
        });
        if (stringToCheck === 'dpm_global_password') {
          await SecureStorage.deleteItem(biometricsType);
          // setSettings({ biometrics: !settings.biometrics });
        }
      }
    },
    [setSettings, settings.biometrics],
  );

  const areBiometricsSupported = useCallback(async () => {
    try {
      const supported = await Keychain.getSupportedBiometryType();
      setBiometricsSupported(supported != null);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    areBiometricsSupported();
  }, [areBiometricsSupported]);

  return (
    <StyledSafeAreaView
      scrollable
      style={styles.background}
      topBar={<TopBar style={styles.topBar} stackProps={{ navigation }} title={t('settings')} />}
    >
      {/* General section */}
      <Flexible.Section title={t('general')}>
        <OpenSettingScreenButton title={t('display mode')} route={ROUTES.SETTINGS_DISPLAY_MODE} />
        <OpenSettingScreenButton title={t('switch chain')} route={ROUTES.SETTINGS_SWITCH_CHAIN} />
      </Flexible.Section>

      {/* Security section */}
      <Flexible.Section style={styles.sectionMargin} title={t('security')}>
        <OpenSettingScreenButton
          title={t('change application password')}
          route={ROUTES.SETTINGS_CHANGE_APPLICATION_PASSWORD}
        />
        <Flexible.SectionSwitch
          label={t('enable face id for signature')}
          value={settings.biometrics}
          isDisabled={!biometricsSupported}
          onPress={
            settings.biometrics
              ? () => turnOffBiometrics('biometricsSignature')
              : () => navigateHandleBiometrics('biometricsSignature')
          }
        />
        <Flexible.SectionSwitch
          label={t('enable face id for login')}
          value={settings.biometrics}
          isDisabled={!biometricsSupported}
          onPress={
            settings.biometrics
              ? () => turnOffBiometrics('biometricsLogin')
              : () => navigateHandleBiometrics('biometricsLogin')
          }
        />
      </Flexible.Section>

      {/* Support section */}
      <Flexible.Section style={styles.sectionMargin} title={t('support')}>
        <Flexible.SectionButton label={t('feedback')} onPress={sendFeedback} />
        <OpenSettingScreenButton
          title={t('join community')}
          route={ROUTES.SETTINGS_JOIN_COMMUNITY}
        />
      </Flexible.Section>

      {/* About section */}
      <Flexible.Section style={styles.sectionMargin} title={t('about')}>
        <Flexible.SectionButton label={t('about dpm')} onPress={openAbout} />
        <Flexible.SectionButton label={t('privacy policy')} onPress={openPrivacy} />
        <Flexible.SectionButton label={t('open source')} onPress={navigateToGithub} />
        <Flexible.SectionText label={t('version')} value={DeviceInfo.getVersion()} />
      </Flexible.Section>
    </StyledSafeAreaView>
  );
};

export default Settings;
