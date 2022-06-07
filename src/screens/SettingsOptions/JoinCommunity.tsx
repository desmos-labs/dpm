import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking } from 'react-native';
import { useTheme } from 'react-native-paper';
import { StyledSafeAreaView, TopBar } from '../../components';
import FlexibleSection from '../../components/FlexibleSection';
import { makeStyle } from '../../theming';
import { RootStackParams, SettingsScreensStackParams } from '../../types/navigation';

type Props = CompositeScreenProps<
  StackScreenProps<SettingsScreensStackParams, 'JoinCommunity'>,
  StackScreenProps<RootStackParams>
>;

const JoinCommunity: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const theme = useTheme();

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
      topBar={<TopBar style={styles.background} stackProps={props} title={t('community')} />}
    >
      <FlexibleSection.Section>
        <FlexibleSection.SectionButton
          label={t('website')}
          icon={
            theme.dark
              ? require('../../assets/community-icons/desmos-dark.png')
              : require('../../assets/community-icons/desmos.png')
          }
          onPress={() => navigateToExternalSite('https://www.desmos.network/')}
        />
        <FlexibleSection.SectionButton
          label={t('discord')}
          icon={
            theme.dark
              ? require('../../assets/community-icons/discord-dark.png')
              : require('../../assets/community-icons/discord.png')
          }
          onPress={() => navigateToExternalSite('https://discord.com/invite/yxPRGdq')}
        />
        <FlexibleSection.SectionButton
          label={t('twitter')}
          icon={
            theme.dark
              ? require('../../assets/community-icons/twitter-dark.png')
              : require('../../assets/community-icons/twitter.png')
          }
          onPress={navigateToTwitterApp}
        />
        <FlexibleSection.SectionButton
          label={t('medium')}
          icon={
            theme.dark
              ? require('../../assets/community-icons/medium-dark.png')
              : require('../../assets/community-icons/medium.png')
          }
          onPress={() => navigateToExternalSite('https://medium.com/desmosnetwork')}
        />
        <FlexibleSection.SectionButton
          label={t('block explorer')}
          icon={
            theme.dark
              ? require('../../assets/community-icons/bigdipper-dark.png')
              : require('../../assets/community-icons/bigdipper.png')
          }
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
