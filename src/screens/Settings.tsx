import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { StyledSafeAreaView, TopBar, Settings as SettingsComponents } from '../components';
import { makeStyle } from '../theming';
import { AccountScreensStackParams } from '../types/navigation';

type Props = StackScreenProps<AccountScreensStackParams, 'Settings'>;

const Settings: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const styles = useStyles();

  return (
    <StyledSafeAreaView
      style={styles.background}
      scrollable
      topBar={<TopBar style={styles.background} stackProps={props} title={t('settings')} />}
    >
      <SettingsComponents.Section title={t('general')}>
        <SettingsComponents.Select label={t('display mode')} />
      </SettingsComponents.Section>
      <SettingsComponents.Section style={styles.sectionMargin} title={t('security')}>
        <SettingsComponents.Select label={t('version')} />
        <SettingsComponents.Select label={t('version')} />
        <SettingsComponents.Select label={t('version')} />
      </SettingsComponents.Section>
      <SettingsComponents.Section style={styles.sectionMargin} title={t('support')}>
        <SettingsComponents.Select label={t('feedback')} />
        <SettingsComponents.Select label={t('join community')} />
      </SettingsComponents.Section>
      <SettingsComponents.Section style={styles.sectionMargin} title={t('about')}>
        <SettingsComponents.Select label={t('version')} />
        <SettingsComponents.Select label={t('version')} />
        <SettingsComponents.Select label={t('version')} />
        <SettingsComponents.ReadOnlyValue label={t('version')} value="v0.0.1" />
      </SettingsComponents.Section>
    </StyledSafeAreaView>
  );
};

const useStyles = makeStyle((theme) => ({
  background: {
    backgroundColor: theme.colors.surface2,
  },
  sectionMargin: {
    marginTop: theme.spacing.l,
  },
}));

export default Settings;
