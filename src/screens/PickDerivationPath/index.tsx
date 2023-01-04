import { StackScreenProps } from '@react-navigation/stack';
import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Typography from 'components/Typography';
import { Wallet } from 'types/wallet';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import Button from 'components/Button';
// eslint-disable-next-line import/no-cycle
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { WalletPickerParams } from 'screens/PickDerivationPath/components/WalletPicker/types';
import useStyles from './useStyles';
import WalletPicker from './components/WalletPicker';

export type SelectAccountParams = {
  walletPickerParams: WalletPickerParams;
};

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.SELECT_ACCOUNT>;

const SelectAccount: FC<NavProps> = (props) => {
  const {
    navigation,
    route: { params },
  } = props;
  const { t } = useTranslation();
  const styles = useStyles();
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [generatingAddresses, setGeneratingAddresses] = useState(false);

  return (
    <StyledSafeAreaView style={styles.root} topBar={<TopBar stackProps={props} />}>
      <Typography.Title>{t('import accounts')}</Typography.Title>

      <Typography.Body>{t('select account or enter derivation path')}.</Typography.Body>

      <WalletPicker
        onWalletSelected={setSelectedWallet}
        onGeneratingAddressesStateChange={setGeneratingAddresses}
        params={params.walletPickerParams}
      />

      <Button
        style={styles.nextButton}
        mode="contained"
        disabled={selectedWallet === null || generatingAddresses}
      >
        {t('next')}
      </Button>
    </StyledSafeAreaView>
  );
};

export default SelectAccount;
