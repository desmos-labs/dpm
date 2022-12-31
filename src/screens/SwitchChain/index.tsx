import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import useDesmosClientContext from 'contexts/DesmosClientContext';
import useWalletConnectContext from 'contexts/WalletConnectContext';
import useSetSetting from 'hooks/settings/useSetSetting';
import useSetting from 'hooks/settings/useSetting';
import { ChainId } from 'types/chain';
import { AccountScreensStackParams } from 'types/navigation';
import RadioGroup, {RadioValue} from 'components/RadioGroup';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import useStyles from './useStyles';

type Props = StackScreenProps<AccountScreensStackParams, 'SettingsScreens'>;

const SwitchChain: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const chainId = useSetting('chainId');
  const setChainId = useSetSetting('chainId');
  const clientContext = useDesmosClientContext();
  const { controller } = useWalletConnectContext();
  const styles = useStyles();

  const changeChain = (newChainId: ChainId) => {
    setChainId(newChainId);
    clientContext.setCurrentChainId(newChainId);
    return Promise.all(
      controller.sessions.map(async (session) => controller.terminateSession(session.id)),
    );
  };

  const values: RadioValue[] = [
    {
      label: t('mainnet'),
      value: 'mainnet',
      status: chainId === 'mainnet' ? 'checked' : 'unchecked',
      onPress: () => changeChain('mainnet'),
    },
    {
      label: t('testnet'),
      value: 'testnet',
      status: chainId === 'testnet' ? 'checked' : 'unchecked',
      onPress: () => changeChain('testnet'),
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

export default SwitchChain;
