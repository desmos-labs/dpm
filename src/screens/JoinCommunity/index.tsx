import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking } from 'react-native';
import { useTheme } from 'react-native-paper';
import Flexible from 'components/Flexible';
import { RootStackParams, SettingsScreensStackParams } from 'types/navigation';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import useStyles from './useStyles';

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
        console.error("Couldn't load page", err),
      );
    });
  }, []);

  return (
    <StyledSafeAreaView
      style={styles.background}
      topBar={<TopBar style={styles.background} stackProps={props} title={t('community')} />}
    >
      <Flexible.Section>
        <Flexible.SectionButton
          label={t('website')}
          icon={
            theme.dark
              ? require('assets/images/community/desmos-dark.png')
              : require('assets/images/community/desmos.png')
          }
          onPress={() => navigateToExternalSite('https://www.desmos.network/')}
        />
        <Flexible.SectionButton
          label={t('discord')}
          icon={
            theme.dark
              ? require('assets/images/community/discord-dark.png')
              : require('assets/images/community/discord.png')
          }
          onPress={() => navigateToExternalSite('https://discord.com/invite/yxPRGdq')}
        />
        <Flexible.SectionButton
          label={t('twitter')}
          icon={
            theme.dark
              ? require('assets/images/community/twitter-dark.png')
              : require('assets/images/community/twitter.png')
          }
          onPress={navigateToTwitterApp}
        />
        <Flexible.SectionButton
          label={t('medium')}
          icon={
            theme.dark
              ? require('assets/images/community/medium-dark.png')
              : require('assets/images/community/medium.png')
          }
          onPress={() => navigateToExternalSite('https://medium.com/desmosnetwork')}
        />
        <Flexible.SectionButton
          label={t('block explorer')}
          icon={
            theme.dark
              ? require('assets/images/community/bigdipper-dark.png')
              : require('assets/images/community/bigdipper.png')
          }
          onPress={() => navigateToExternalSite('https://explorer.desmos.network/')}
        />
      </Flexible.Section>
    </StyledSafeAreaView>
  );
};

export default JoinCommunity;
