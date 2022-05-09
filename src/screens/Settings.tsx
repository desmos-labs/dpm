import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { StyledSafeAreaView, TopBar } from '../components';
import FlexibleSection from '../components/FlexibleSection';
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
      console.error("Couldn't open email application", err)
    );
  }, []);

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
      <FlexibleSection.Section title={t('general')}>
        <FlexibleSection.SectionButton label={t('display mode')} onPress={navigateToDisplayMode} />
        <FlexibleSection.SectionButton label={t('switch chain')} onPress={navigateToSwitchChain} />
      </FlexibleSection.Section>
      <FlexibleSection.Section style={styles.sectionMargin} title={t('security')}>
        <FlexibleSection.SectionButton
          label={t('change application password')}
          onPress={navigateToChangePassword}
        />
        <FlexibleSection.SectionSwitch
          label={t('enable face id for signature')}
          isActive={false}
          isDisabled
        />
        <FlexibleSection.SectionSwitch
          label={t('enable face id for login')}
          isActive={false}
          isDisabled
        />
      </FlexibleSection.Section>
      <FlexibleSection.Section style={styles.sectionMargin} title={t('support')}>
        <FlexibleSection.SectionButton label={t('feedback')} onPress={sendFeedback} />
        <FlexibleSection.SectionButton
          label={t('join community')}
          onPress={navigateToJoinCommunity}
        />
      </FlexibleSection.Section>
      <FlexibleSection.Section style={styles.sectionMargin} title={t('about')}>
        <FlexibleSection.SectionButton label={t('about dpm')} onPress={openAbout} />
        <FlexibleSection.SectionButton label={t('privacy policy')} onPress={openPrivacyPolicy} />
        <FlexibleSection.SectionButton label={t('open source')} onPress={navigateToGithub} />
        <FlexibleSection.SectionText label={t('version')} value={DeviceInfo.getVersion()} />
      </FlexibleSection.Section>
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
