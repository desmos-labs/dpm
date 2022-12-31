import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import useSetSetting from 'hooks/settings/useSetSetting';
import useSetting from 'hooks/settings/useSetting';
import { AccountScreensStackParams } from 'types/navigation';
import RadioGroup, {RadioValue} from 'components/RadioGroup';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import useStyles from './useStyles';

type Props = StackScreenProps<AccountScreensStackParams, 'SettingsScreens'>;

const DisplayMode: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const styles = useStyles();
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
      style={styles.background}
      topBar={<TopBar style={styles.background} stackProps={props} title={t('display')} />}
    >
      <RadioGroup values={values} />
    </StyledSafeAreaView>
  );
};

export default DisplayMode;
