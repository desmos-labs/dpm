import { RefreshControl, SectionList, StyleProp, View, ViewStyle } from 'react-native';
import Divider from 'components/Divider';
import React, { useCallback } from 'react';
import { GroupedTransactions } from 'types/transactions';
import { useTheme } from 'react-native-paper';
import TransactionsListSectionHeader from 'screens/Home/components/TransactionsListSectionHeader';
import TransactionsListItem from 'screens/Home/components/TransactionsListItem';
import useStyles from './useStyles';

export interface TransactionsListProps {
  readonly loading: boolean;
  readonly transactions: GroupedTransactions[];
  readonly onFetchMore: () => void;
  readonly onRefresh: () => void;
  readonly style?: StyleProp<ViewStyle>;
}

const TransactionsList = (props: TransactionsListProps) => {
  const { loading, transactions, onFetchMore, onRefresh, style } = props;
  const theme = useTheme();
  const styles = useStyles();

  const sections = transactions.map((enty) => ({ date: enty.date, data: enty.transactions }));

  const fetchMore = useCallback(() => onFetchMore(), [onFetchMore]);
  const refresh = useCallback(() => onRefresh(), [onRefresh]);

  return (
    <SectionList
      style={style}
      sections={sections}
      stickySectionHeadersEnabled={false}
      renderItem={(info) => (
        <TransactionsListItem
          index={info.index}
          transaction={info.item}
          sectionLength={info.section.data.length}
        />
      )}
      renderSectionHeader={(info) => <TransactionsListSectionHeader date={info.section.date} />}
      renderSectionFooter={() => <View style={styles.footer} />}
      keyExtractor={(_, index) => index.toString()}
      onEndReached={fetchMore}
      onEndReachedThreshold={0.5}
      refreshControl={
        <RefreshControl
          enabled
          refreshing={loading}
          onRefresh={refresh}
          colors={[theme.colors.primary]}
          tintColor={theme.colors.primary}
        />
      }
      showsVerticalScrollIndicator
      ItemSeparatorComponent={Divider}
    />
  );
};

export default TransactionsList;
