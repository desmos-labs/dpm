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
import useStyles from './useStyles';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.SETTINGS_SWITCH_CHAIN>;

const SettingsSwitchChain = (props: NavProps) => {
  const { t } = useTranslation('settings');
  const styles = useStyles();

  const chainName = useSetting('chainName');
  const setChainName = useSetSetting('chainName');

  const changeChain = (newChainName: string) => {
    setChainName(newChainName);
  };

  const values: RadioValue[] = [
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
  ];

  return (
    <StyledSafeAreaView
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
