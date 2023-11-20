import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import RadioGroup, { RadioValue } from 'components/RadioGroup';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import { useSetSetting, useSetting } from '@recoil/settings';
import Typography from 'components/Typography';
import Spacer from 'components/Spacer';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { useTheme } from 'react-native-paper';
import useStyles from './useStyles';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.SETTINGS_DISPLAY_MODE>;

const SettingsDisplayMode = (props: NavProps) => {
  const { t } = useTranslation('settings');
  const styles = useStyles();
  const appTheme = useTheme();
  const theme = useSetting('theme');
  const setTheme = useSetSetting('theme');

  const values: RadioValue[] = [
    {
      label: t('auto'),
      value: 'auto',
      status: theme === 'auto' ? 'checked' : 'unchecked',
      onPress: () => setTheme('auto'),
    },
    {
      label: t('light'),
      value: 'light',
      status: theme === 'light' ? 'checked' : 'unchecked',
      onPress: () => setTheme('light'),
    },
    {
      label: t('dark'),
      value: 'dark',
      status: theme === 'dark' ? 'checked' : 'unchecked',
      onPress: () => setTheme('dark'),
    },
  ];

  return (
    <StyledSafeAreaView
      customBackgroundColor={appTheme.colors.background2}
      style={styles.background}
      topBar={<TopBar style={styles.background} stackProps={props} title={t('display mode')} />}
    >
      <Typography.Body>{t('display mode description')}</Typography.Body>
      <Spacer paddingVertical={4} />
      <RadioGroup values={values} />
    </StyledSafeAreaView>
  );
};

export default SettingsDisplayMode;
