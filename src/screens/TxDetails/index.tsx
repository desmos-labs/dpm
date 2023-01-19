import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking } from 'react-native';
import TransactionDetails from 'components/TransactionDetails';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import Button from 'components/Button';
import { StackScreenProps } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { Transaction } from 'types/transactions';
import { useGetTransactionExplorerUrl } from 'screens/TxDetails/useHooks';

export type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.TRANSACTION_DETAILS>;

export interface TransactionDetailsParams {
  /**
   * Transaction that should be visualized.
   */
  transaction: Transaction;
}

const TxDetails = (props: NavProps) => {
  const { t } = useTranslation('transaction');

  const { route } = props;
  const { transaction } = route.params;

  const getTransactionExplorerUrl = useGetTransactionExplorerUrl();

  const openExplorer = useCallback(async () => {
    const transactionUrl = getTransactionExplorerUrl(transaction.hash);
    await Linking.openURL(transactionUrl);
  }, [getTransactionExplorerUrl, transaction.hash]);

  return (
    <StyledSafeAreaView topBar={<TopBar stackProps={props} title={t('tx details')} />}>
      <TransactionDetails
        messages={transaction.messages}
        memo={transaction.memo}
        fee={transaction.fee}
        dateTime={new Date(transaction.timestamp)}
        success={transaction.success}
      />
      <Button mode="text" onPress={openExplorer}>
        {t('view on explorer')}
      </Button>
    </StyledSafeAreaView>
  );
};

export default TxDetails;
