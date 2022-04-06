import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import DeviceInfo from 'react-native-device-info';
import { Settings as SettingsComponents, StyledSafeAreaView, TopBar } from '../components';
import { makeStyle } from '../theming';
import { SettingsScreensStackParams } from '../types/navigation';

type Props = StackScreenProps<SettingsScreensStackParams>;

const Settings: React.FC<Props> = (props) => {
  const { navigation } = props;
  const { t } = useTranslation();
  const styles = useStyles();

  return (
    <StyledSafeAreaView
      style={styles.background}
      scrollable
      topBar={<TopBar style={styles.background} stackProps={props} title={t('settings')} />}
    >
      <SettingsComponents.SettingsSection title={t('general')}>
        <SettingsComponents.SettingsButton
          label={t('display mode')}
          onPress={() => {
            navigation.navigate({
              name: 'DisplayMode',
              params: undefined,
            });
          }}
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
        <SettingsComponents.SettingsButton label={t('privacy policy')} />
        <SettingsComponents.SettingsButton label={t('open source')} />
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
