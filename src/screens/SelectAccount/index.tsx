import { StackScreenProps } from '@react-navigation/stack';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Typography from 'components/Typography';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import Button from 'components/Button';
// eslint-disable-next-line import/no-cycle
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { AccountPickerParams } from 'screens/SelectAccount/components/AccountPicker/types';
import { AccountWithWallet } from 'types/account';
import useStyles from './useStyles';
import AccountPicker from './components/AccountPicker';

export type SelectAccountParams = {
  accountPickerParams: AccountPickerParams;
  onSelect: (wallet: AccountWithWallet) => any;
  onCancel?: () => any;
};

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.SELECT_ACCOUNT>;

const SelectAccount: FC<NavProps> = (props) => {
  const { navigation } = props;
  const { onSelect, onCancel, accountPickerParams } = props.route.params;
  const { t } = useTranslation();
  const styles = useStyles();
  const [selectedAccount, setSelectedAccount] = useState<AccountWithWallet | null>(null);
  const [generatingAddresses, setGeneratingAddresses] = useState(false);
  const onNextPressed = useCallback(() => {
    if (selectedAccount !== null) {
      onSelect(selectedAccount);
    }
  }, [onSelect, selectedAccount]);

  useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        if (e.data.action.type === 'GO_BACK' && onCancel !== undefined) {
          onCancel();
        }
      }),
    [navigation, onCancel],
  );

  return (
    <StyledSafeAreaView style={styles.root} topBar={<TopBar stackProps={props} />}>
      <Typography.Title>{t('import accounts')}</Typography.Title>

      <Typography.Body>{t('select account or enter derivation path')}.</Typography.Body>

      <AccountPicker
        onAccountSelected={setSelectedAccount}
        onGeneratingAddressesStateChange={setGeneratingAddresses}
        params={accountPickerParams}
      />

      <Button
        style={styles.nextButton}
        mode="contained"
        disabled={selectedAccount === null || generatingAddresses}
        onPress={onNextPressed}
      >
        {t('next')}
      </Button>
    </StyledSafeAreaView>
  );
};

export default SelectAccount;
