import { useSdkContext } from '@desmoslabs/sdk-react';
import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyledSafeAreaView, TopBar } from '../../components';
import { RadioGroup, RadioValue } from '../../components/RadioGroup';
import { useWalletConnectContext } from '../../contexts/WalletConnectContext';
import useSetSetting from '../../hooks/settings/useSetSetting';
import useSetting from '../../hooks/settings/useSetting';
import { makeStyle } from '../../theming';
import { ChainId } from '../../types/chain';
import { AccountScreensStackParams } from '../../types/navigation';

type Props = StackScreenProps<AccountScreensStackParams, 'SettingsScreens'>;

const SwitchChain: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const chainId = useSetting('chainId');
  const setChainId = useSetSetting('chainId');
  const sdkContext = useSdkContext();
  const { controller } = useWalletConnectContext();
  const styles = useStyles();
  
  const changeChain = (newChainId: ChainId) => {
    setChainId(newChainId);
    sdkContext.setCurrentChainId(newChainId);
    return Promise.all(
      controller.sessions.map(async (session) => controller.terminateSession(session.id))
    );
  }

  const values: RadioValue[] = [
    {
      label: t('mainnet'),
      value: 'mainnet',
      status: chainId === 'desmos-mainnet' ? 'checked' : 'unchecked',
      onPress: () => changeChain('desmos-mainnet'),
    },
    {
      label: t('testnet'),
      value: 'testnet',
      status: chainId === 'morpheus-apollo-2' ? 'checked' : 'unchecked',
      onPress: () => changeChain('morpheus-apollo-2'),
    },
  ];

  return (
    <StyledSafeAreaView
      style={styles.background}
      scrollable
      topBar={<TopBar style={styles.background} stackProps={props} title={t('chain')} />}
    >
      <RadioGroup values={values} />
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

export default SwitchChain;
