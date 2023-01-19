import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import DpmImage from 'components/DPMImage';
import Typography from 'components/Typography';
import TransactionsList from 'screens/Home/components/TransactionsList';
import { DPMImages } from 'types/images';
import { GroupedTransactions } from 'types/transactions';
import useStyles from './useStyles';

export type AccountTransactionsProps = {
  readonly transactions: GroupedTransactions[];
  readonly loading: boolean;
  readonly onReload: () => void;
  readonly onFetchMore: () => void;
};

const AccountTransactions = (props: AccountTransactionsProps) => {
  const { t } = useTranslation('account');
  const styles = useStyles();
  const { transactions, loading, onReload, onFetchMore } = props;

  const fetchMore = useCallback(onFetchMore, [onFetchMore]);
  const reloadFromChain = useCallback(onReload, [onReload]);

  return transactions?.length > 0 || loading ? (
    <TransactionsList
      loading={loading}
      transactions={transactions}
      onFetchMore={fetchMore}
      onRefresh={reloadFromChain}
    />
  ) : (
    <View style={styles.noTransactionsView}>
      <DpmImage
        style={styles.noTransactionsImage}
        resizeMode="contain"
        source={DPMImages.NoTransaction}
      />
      <Typography.Body1>{t('no transactions')}</Typography.Body1>
    </View>
  );
};

export default AccountTransactions;
