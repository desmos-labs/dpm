import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking } from 'react-native';
import { useTheme } from 'react-native-paper';
import Flexible from 'components/Flexible';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import {
  bigDipperIconDark,
  bigDipperIconLight,
  desmosIconDark,
  desmosIconLight,
  discordIconDark,
  discordIconLight,
  mediumIconDark,
  mediumIconLight,
  twitterIconDark,
  twitterIconLight,
} from 'assets/images';
import Typography from 'components/Typography';
import Spacer from 'components/Spacer';
import useStyles from './useStyles';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.SETTINGS_JOIN_COMMUNITY>;

const SettingsJoinCommunity = (props: NavProps) => {
  const { t } = useTranslation('settings');
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
      topBar={<TopBar style={styles.background} stackProps={props} title={t('join community')} />}
    >
      <Typography.Body>{t('join community description')}</Typography.Body>

      <Spacer paddingVertical={8} />

      {/* Community links */}
      <Flexible.Section>
        <Flexible.SectionButton
          label={t('common:website')}
          icon={theme.dark ? desmosIconDark : desmosIconLight}
          onPress={() => navigateToExternalSite('https://www.desmos.network/')}
        />
        <Flexible.SectionButton
          label={t('common:discord')}
          icon={theme.dark ? discordIconDark : discordIconLight}
          onPress={() => navigateToExternalSite('https://discord.desmos.network')}
        />
        <Flexible.SectionButton
          label={t('common:twitter')}
          icon={theme.dark ? twitterIconDark : twitterIconLight}
          onPress={navigateToTwitterApp}
        />
        <Flexible.SectionButton
          label={t('common:medium')}
          icon={theme.dark ? mediumIconDark : mediumIconLight}
          onPress={() => navigateToExternalSite('https://medium.com/desmosnetwork')}
        />
        <Flexible.SectionButton
          label={t('block explorer')}
          icon={theme.dark ? bigDipperIconDark : bigDipperIconLight}
          onPress={() => navigateToExternalSite('https://explorer.desmos.network/')}
        />
      </Flexible.Section>
    </StyledSafeAreaView>
  );
};

export default SettingsJoinCommunity;
