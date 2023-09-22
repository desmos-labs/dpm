import { StackScreenProps } from '@react-navigation/stack';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Typography from 'components/Typography';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import Button from 'components/Button';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import {
  AccountPickerParams,
  WalletPickerMode,
} from 'screens/SelectAccount/components/AccountPicker/types';
import { AccountWithWallet } from 'types/account';
import Spacer from 'components/Spacer';
import AccountPicker from './components/AccountPicker';

export type SelectAccountParams = {
  accountPickerParams: AccountPickerParams;
  onSelect: (wallet: AccountWithWallet) => any;
  onCancel?: () => any;
};

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.SELECT_ACCOUNT>;

/**
 * Screen that let the user select a list of accounts.
 */
const SelectAccount: FC<NavProps> = (props) => {
  const { t } = useTranslation('account');

  const { navigation } = props;
  const { onSelect, onCancel, accountPickerParams } = props.route.params;

  const [selectedAccounts, setSelectedAccounts] = useState<AccountWithWallet[]>([]);

  const onNextPressed = useCallback(() => {
    if (selectedAccounts.length > 0) {
      onSelect(selectedAccounts[0]);
    }
  }, [onSelect, selectedAccounts]);

  const descriptionText = useMemo(() => {
    if (
      accountPickerParams.mode === WalletPickerMode.Ledger ||
      accountPickerParams.mode === WalletPickerMode.Mnemonic
    ) {
      return t('select account or enter derivation path');
    }

    return t('select account');
  }, [accountPickerParams, t]);

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
    <StyledSafeAreaView
      topBar={<TopBar stackProps={props} />}
      touchableWithoutFeedbackDisabled={false}
    >
      <Typography.H5 capitalize>{t('select account')}</Typography.H5>
      <Typography.Regular14>{descriptionText}.</Typography.Regular14>

      <Spacer paddingVertical={8} />

      <AccountPicker onSelectedAccountsChange={setSelectedAccounts} params={accountPickerParams} />

      <Button mode="contained" disabled={selectedAccounts.length === 0} onPress={onNextPressed}>
        {t('next')}
      </Button>
    </StyledSafeAreaView>
  );
};

export default SelectAccount;
