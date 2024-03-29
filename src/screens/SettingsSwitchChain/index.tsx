import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import RadioGroup, { RadioValue } from 'components/RadioGroup';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import { useSetSetting, useSetting } from '@recoil/settings';
import { DesmosMainnet, DesmosTestnet } from '@desmoslabs/desmjs';
import Typography from 'components/Typography';
import Spacer from 'components/Spacer';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { useSetHomeShouldReloadData } from '@recoil/home';
import { useTheme } from 'react-native-paper';
import useStyles from './useStyles';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.SETTINGS_SWITCH_CHAIN>;

const SettingsSwitchChain = (props: NavProps) => {
  const { t } = useTranslation('settings');
  const styles = useStyles();
  const theme = useTheme();

  const chainName = useSetting('chainName');
  const setChainName = useSetSetting('chainName');
  const setHomeShouldReloadData = useSetHomeShouldReloadData();

  const changeChain = React.useCallback(
    (newChainName: string) => {
      setHomeShouldReloadData(true);
      setChainName(newChainName);
    },
    [setChainName, setHomeShouldReloadData],
  );

  const values: RadioValue[] = React.useMemo(
    () => [
      {
        label: t('testnet'),
        value: DesmosTestnet.chainName,
        status: chainName === DesmosTestnet.chainName ? 'checked' : 'unchecked',
        onPress: () => changeChain(DesmosTestnet.chainName),
      },
      {
        label: t('mainnet'),
        value: DesmosMainnet.chainName,
        status: chainName === DesmosMainnet.chainName ? 'checked' : 'unchecked',
        onPress: () => changeChain(DesmosMainnet.chainName),
      },
    ],
    [chainName, changeChain, t],
  );

  return (
    <StyledSafeAreaView
      customBackgroundColor={theme.colors.background2}
      scrollable
      style={styles.background}
      topBar={<TopBar style={styles.background} stackProps={props} title={t('switch chain')} />}
    >
      <Typography.Body>{t('switch chain description')}</Typography.Body>
      <Spacer paddingVertical={4} />
      <RadioGroup values={values} />
    </StyledSafeAreaView>
  );
};

export default SettingsSwitchChain;
