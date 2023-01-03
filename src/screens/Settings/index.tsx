import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Keychain from 'react-native-keychain';
import Flexible from 'components/Flexible';
import useSetSettings from 'hooks/settings/useSetSettings';
import { RootStackParams, SettingsScreensStackParams } from 'types/navigation';
import * as SecureStorage from 'lib/SecureStorage';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import { useRecoilValue } from 'recoil';
import appSettingsState from '@recoil/settings';
import useStyles from './useStyles';

declare type Props = CompositeScreenProps<
  StackScreenProps<SettingsScreensStackParams>,
  StackScreenProps<RootStackParams>
>;

const Settings: React.FC<Props> = (props) => {
  const { navigation } = props;
  const { t } = useTranslation();
  const styles = useStyles();
  const settings = useRecoilValue(appSettingsState);
  const setSettings = useSetSettings();
  const [biometricsSupported, setBiometricsSupported] = React.useState<boolean>(false);

  const openPrivacyPolicy = useCallback(async () => {
    navigation.navigate({
      name: 'MarkdownText',
      params: {
        title: t('privacy policy'),
        asset: Platform.OS === 'android' ? 'custom/privacy.md' : '/privacy.md',
      },
    });
  }, [navigation, t]);

  const openAbout = useCallback(async () => {
    navigation.navigate({
      name: 'MarkdownText',
      params: {
        title: t('about dpm'),
        asset: Platform.OS === 'android' ? 'custom/about.md' : '/about.md',
      },
    });
  }, [navigation, t]);

  const navigateToDisplayMode = useCallback(async () => {
    navigation.navigate({
      name: 'DisplayMode',
      params: undefined,
    });
  }, [navigation]);

  const navigateToSwitchChain = useCallback(async () => {
    navigation.navigate({
      name: 'SwitchChain',
      params: undefined,
    });
  }, [navigation]);

  const navigateToJoinCommunity = useCallback(async () => {
    navigation.navigate({
      name: 'JoinCommunity',
      params: undefined,
    });
  }, [navigation]);

  const navigateToChangePassword = useCallback(async () => {
    navigation.navigate({
      name: 'CheckOldPassword',
      params: undefined,
    });
  }, [navigation]);

  const sendFeedback = useCallback(async () => {
    Linking.openURL('mailto:development@forbole.com').catch((err) =>
      console.error("Couldn't open email application", err),
    );
  }, []);

  const navigateToGithub = useCallback(() => {
    Linking.openURL('https://github.com/desmos-labs/dpm').catch((err) =>
      console.error("Couldn't load page", err),
    );
  }, []);

  const navigateHandleBiometrics = useCallback(
    async (biometricsType: 'biometricsLogin' | 'biometricsSignature') => {
      navigation.navigate({
        name: 'HandleBiometrics',
        params: { biometricsType },
      });
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
          setSettings({ biometrics: !settings.biometrics });
        }
      }
    },
    [setSettings, settings.biometrics],
  );

  const areBiometricsSupported = useCallback(async () => {
    try {
      const supported = await Keychain.getSupportedBiometryType();
      if (supported) {
        setBiometricsSupported(true);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    areBiometricsSupported();
  }, [areBiometricsSupported]);

  return (
    <StyledSafeAreaView
      style={styles.background}
      scrollable
      topBar={<TopBar style={styles.background} stackProps={props} title={t('settings')} />}
    >
      <Flexible.Section title={t('general')}>
        <Flexible.SectionButton label={t('display mode')} onPress={navigateToDisplayMode} />
        <Flexible.SectionButton label={t('switch chain')} onPress={navigateToSwitchChain} />
      </Flexible.Section>
      <Flexible.Section style={styles.sectionMargin} title={t('security')}>
        <Flexible.SectionButton
          label={t('change application password')}
          onPress={navigateToChangePassword}
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
      <Flexible.Section style={styles.sectionMargin} title={t('support')}>
        <Flexible.SectionButton label={t('feedback')} onPress={sendFeedback} />
        <Flexible.SectionButton
          label={t('join community')}
          onPress={navigateToJoinCommunity}
        />
      </Flexible.Section>
      <Flexible.Section style={styles.sectionMargin} title={t('about')}>
        <Flexible.SectionButton label={t('about dpm')} onPress={openAbout} />
        <Flexible.SectionButton label={t('privacy policy')} onPress={openPrivacyPolicy} />
        <Flexible.SectionButton label={t('open source')} onPress={navigateToGithub} />
        <Flexible.SectionText label={t('version')} value={DeviceInfo.getVersion()} />
      </Flexible.Section>
    </StyledSafeAreaView>
  );
};

export default Settings;
