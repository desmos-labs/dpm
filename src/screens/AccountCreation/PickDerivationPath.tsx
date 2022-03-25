import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, StyledSafeAreaView, TopBar } from '../../components';
import { WalletPicker } from '../../components/WalletPicker';
import { makeStyle } from '../../theming';
import { DesmosHdPath } from '../../types/hdpath';
import { DesmosLedgerApp } from '../../types/ledger';
import { AccountCreationStackParams } from '../../types/navigation';
import { Wallet } from '../../types/wallet';
import { Typography } from '../../components/typography';

export type Props = StackScreenProps<AccountCreationStackParams, 'PickDerivationPath'>;

export const PickDerivationPath: React.FC<Props> = (props) => {
  const {
    navigation,
    route: { params },
  } = props;
  const { mnemonic, ledgerTransport } = params;
  const { t } = useTranslation();
  const styles = useStyles();
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [generatingAddresses, setGeneratingAddresses] = useState(false);

  const onNextPressed = useCallback(async () => {
    if (selectedWallet !== null) {
      navigation.navigate({
        name: 'CreateWalletPassword',
        params: {
          wallet: selectedWallet,
        },
      });
    }
  }, [navigation, selectedWallet]);

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

const useStyles = makeStyle((theme) => ({
  root: {
    paddingTop: 0,
  },
  hpPathLabel: {
    marginTop: theme.spacing.l,
  },
  hdPathPicker: {
    marginTop: theme.spacing.s,
  },
  addressText: {
    marginTop: theme.spacing.m,
  },
  dividerContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.s,
  },
  dividerLine: {
    flex: 4,
  },
  dividerText: {
    flex: 2,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  toggleSelectAccount: {
    marginTop: theme.spacing.l,
  },
  toggleSelectAccountEnabled: {
    color: theme.colors.primary,
  },
  addressesList: {
    flex: 1,
    marginTop: theme.spacing.s,
  },
  nextButton: {
    marginTop: theme.spacing.m,
  },
  disabledText: {
    color: theme.colors.disabled,
  },
}));
