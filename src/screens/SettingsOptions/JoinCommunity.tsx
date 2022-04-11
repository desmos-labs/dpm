import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking } from 'react-native';
import { StyledSafeAreaView, TopBar } from '../../components';
import FlexibleSection from '../../components/FlexibleSection';
import { makeStyle } from '../../theming';
import { RootStackParams, SettingsScreensStackParams } from '../../types/navigation';

declare type Props = CompositeScreenProps<
  StackScreenProps<SettingsScreensStackParams>,
  StackScreenProps<RootStackParams>
>;

const JoinCommunity: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const styles = useStyles();

  const navigateToExternalSite = useCallback((url: string) => {
    Linking.openURL(url).catch((err) => console.error("Couldn't load page", err));
  }, []);

  const navigateToTwitterApp = useCallback(() => {
    Linking.openURL('twitter://user?screen_name=DesmosNetwork').catch(() => {
      Linking.openURL('https://www.twitter.com/DesmosNetwork').catch((err) =>
        console.error("Couldn't load page", err)
      );
    });
  }, []);

  return (
    <StyledSafeAreaView
      style={styles.background}
      scrollable
      topBar={<TopBar style={styles.background} stackProps={props} title={t('community')} />}
    >
      <FlexibleSection.Section>
        <FlexibleSection.SectionButton
          label={t('website')}
          icon={require('../../assets/community-icons/desmos-website.png')}
          onPress={() => navigateToExternalSite('https://www.desmos.network/')}
        />
        <FlexibleSection.SectionButton
          label={t('discord')}
          icon={require('../../assets/community-icons/discord.png')}
          onPress={() => navigateToExternalSite('https://discord.com/invite/yxPRGdq')}
        />
        <FlexibleSection.SectionButton
          label={t('twitter')}
          icon={require('../../assets/community-icons/twitter.png')}
          onPress={navigateToTwitterApp}
        />
        <FlexibleSection.SectionButton
          label={t('medium')}
          icon={require('../../assets/community-icons/medium.png')}
          onPress={() => navigateToExternalSite('https://medium.com/desmosnetwork')}
        />
        <FlexibleSection.SectionButton
          label={t('block explorer')}
          icon={require('../../assets/community-icons/bigdipper.png')}
          onPress={() => navigateToExternalSite('https://explorer.desmos.network/')}
        />
      </FlexibleSection.Section>
    </StyledSafeAreaView>
  );
};

const useStyles = makeStyle((theme) => ({
  background: {
    backgroundColor: theme.colors.background2,
  },
}));

export default JoinCommunity;
