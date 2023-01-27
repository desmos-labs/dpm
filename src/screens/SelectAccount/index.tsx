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
import useStyles from './useStyles';
import AccountPicker from './components/AccountPicker';

export type SelectAccountParams = {
  accountPickerParams: AccountPickerParams;
  onSelect: (wallet: AccountWithWallet) => any;
  onCancel?: () => any;
};

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.SELECT_ACCOUNT>;

const SelectAccount: FC<NavProps> = (props) => {
  const styles = useStyles();
  const { t } = useTranslation('account');

  const { navigation } = props;
  const { onSelect, onCancel, accountPickerParams } = props.route.params;

  const [selectedAccount, setSelectedAccount] = useState<AccountWithWallet | null>(null);

  const onNextPressed = useCallback(() => {
    if (selectedAccount !== null) {
      onSelect(selectedAccount);
    }
  }, [onSelect, selectedAccount]);

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
      style={styles.root}
      topBar={<TopBar stackProps={props} title={t('import account')} />}
      touchableWithoutFeedbackDisabled={false}
    >
      <Typography.Body>{descriptionText}.</Typography.Body>

      <AccountPicker onAccountSelected={setSelectedAccount} params={accountPickerParams} />

      <Button mode="contained" disabled={!selectedAccount} onPress={onNextPressed}>
        {t('next')}
      </Button>
    </StyledSafeAreaView>
  );
};

export default SelectAccount;
