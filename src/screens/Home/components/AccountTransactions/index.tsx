import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, View, ViewStyle } from 'react-native';
import DpmImage from 'components/DPMImage';
import Typography from 'components/Typography';
import useActiveAccountTransactions from 'hooks/useActiveAccountTransactions';
import { Account } from 'types/account';
import TransactionsList from 'screens/Home/components/TransactionsList';
import { DPMImages } from 'types/images';
import useStyles from './useStyles';

export type AccountTransactionsProps = {
  account: Account;
  style?: StyleProp<ViewStyle>;
};

const AccountTransactions = (props: AccountTransactionsProps) => {
  const { style } = props;
  const { t } = useTranslation();
  const styles = useStyles();

  const { loading, transactions, refetch, fetchMore } = useActiveAccountTransactions();

  const onFetchMore = useCallback(() => {
    fetchMore();
  }, [fetchMore]);

  const reloadFromChain = useCallback(() => {
    refetch();
  }, [refetch]);

  return transactions.length > 0 || loading ? (
    <TransactionsList
      loading={loading}
      transactions={transactions}
      onFetchMore={onFetchMore}
      onRefresh={reloadFromChain}
      style={style}
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
