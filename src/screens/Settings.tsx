import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { Settings as SettingsComponents, StyledSafeAreaView, TopBar } from '../components';
import { makeStyle } from '../theming';
import { RootStackParams, SettingsScreensStackParams } from '../types/navigation';

declare type Props = CompositeScreenProps<
  StackScreenProps<SettingsScreensStackParams>,
  StackScreenProps<RootStackParams>
>;

const Settings: React.FC<Props> = (props) => {
  const { navigation } = props;
  const { t } = useTranslation();
  const styles = useStyles();

  const openPrivacyPolicy = useCallback(async () => {
    navigation.navigate({
      name: 'MarkdownText',
      params: {
        title: t('Privacy Policy'),
        asset: 'custom/privacy.md',
      },
    });
  }, [navigation, t]);

  const navigateToDisplayMode = useCallback(async () => {
    navigation.navigate({
      name: 'DisplayMode',
      params: undefined,
    });
  }, [navigation]);

  const navigateToGithub = useCallback(() => {
    Linking.openURL('https://github.com/desmos-labs/dpm').catch((err) =>
      console.error("Couldn't load page", err)
    );
  }, []);

  return (
    <StyledSafeAreaView
      style={styles.background}
      scrollable
      topBar={<TopBar style={styles.background} stackProps={props} title={t('settings')} />}
    >
      <SettingsComponents.SettingsSection title={t('general')}>
        <SettingsComponents.SettingsButton
          label={t('display mode')}
          onPress={navigateToDisplayMode}
        />
      </SettingsComponents.SettingsSection>
      <SettingsComponents.SettingsSection style={styles.sectionMargin} title={t('security')}>
        <SettingsComponents.SettingsButton label={t('change wallet password')} />
        <SettingsComponents.SettingsSwitch label={t('enable face id for signature')} isActive />
        <SettingsComponents.SettingsSwitch label={t('enable face id for login')} isActive={false} />
      </SettingsComponents.SettingsSection>
      <SettingsComponents.SettingsSection style={styles.sectionMargin} title={t('support')}>
        <SettingsComponents.SettingsButton label={t('feedback')} />
        <SettingsComponents.SettingsButton label={t('join community')} />
      </SettingsComponents.SettingsSection>
      <SettingsComponents.SettingsSection style={styles.sectionMargin} title={t('about')}>
        <SettingsComponents.SettingsButton label={t('about dpm')} />
        <SettingsComponents.SettingsButton
          label={t('privacy policy')}
          onPress={openPrivacyPolicy}
        />
        <SettingsComponents.SettingsButton label={t('open source')} onPress={navigateToGithub} />
        <SettingsComponents.SettingsText label={t('version')} value={DeviceInfo.getVersion()} />
      </SettingsComponents.SettingsSection>
    </StyledSafeAreaView>
  );
};

const useStyles = makeStyle((theme) => ({
  background: {
    backgroundColor: theme.colors.background2,
  },
  sectionMargin: {
    marginTop: theme.spacing.l,
  },
}));

export default Settings;
