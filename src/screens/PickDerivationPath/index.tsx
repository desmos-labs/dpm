import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Typography from 'components/Typography';
import useAppContext from 'contexts/AppContext';
import { DesmosHdPath } from 'types/cosmos';
import { DesmosLedgerApp } from 'types/ledger';
import { AccountCreationStackParams } from 'types/navigation';
import { Wallet } from 'types/wallet';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import Button from 'components/Button';
import useStyles from './useStyles';
import WalletPicker from './components/WalletPicker';

export type Props = StackScreenProps<AccountCreationStackParams, 'PickDerivationPath'>;

const PickDerivationPath: React.FC<Props> = (props) => {
  const {
    navigation,
    route: { params },
  } = props;
  const { mnemonic, ledgerTransport } = params;
  const { t } = useTranslation();
  const styles = useStyles();
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [generatingAddresses, setGeneratingAddresses] = useState(false);
  const { accounts } = useAppContext();

  const onNextPressed = useCallback(async () => {
    if (selectedWallet !== null) {
      if (accounts.length === 0) {
        navigation.navigate({
          name: 'CreateWalletPassword',
          params: {
            wallet: selectedWallet,
          },
        });
      } else {
        navigation.navigate({
          name: 'CheckWalletPassword',
          params: {
            addingNewAccount: true,
            wallet: selectedWallet,
          },
        });
      }
    }
  }, [accounts.length, navigation, selectedWallet]);

  return (
    <StyledSafeAreaView style={styles.root} topBar={<TopBar stackProps={props} />}>
      <Typography.Title>{t('import accounts')}</Typography.Title>

      <Typography.Body>{t('select account or enter derivation path')}.</Typography.Body>

      <WalletPicker
        onWalletSelected={setSelectedWallet}
        onGeneratingAddressesStateChange={setGeneratingAddresses}
        mnemonic={mnemonic}
        ledgerTransport={ledgerTransport}
        ledgerApp={DesmosLedgerApp}
        defaultHdPath={DesmosHdPath}
        addressPrefix="desmos"
      />

      <Button
        style={styles.nextButton}
        mode="contained"
        onPress={onNextPressed}
        disabled={selectedWallet === null || generatingAddresses}
      >
        {t('next')}
      </Button>
    </StyledSafeAreaView>
  );
};

export default PickDerivationPath;
