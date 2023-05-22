import { RefreshControl, View } from 'react-native';
import React, { useCallback, useState } from 'react';
import { GroupedTransactions } from 'types/transactions';
import TransactionsListItem from 'screens/Home/components/TransactionsListItem';
import { FlashList } from '@shopify/flash-list';
import TransactionsListSectionHeader from 'screens/Home/components/TransactionsListSectionHeader';
import { useTheme } from 'react-native-paper';
import useStyles from './useStyles';

export interface TransactionsListProps {
  readonly headerComponent?: React.ComponentType<any> | React.ReactElement | null | undefined;
  readonly emptyComponent?: React.ComponentType<any> | React.ReactElement | null | undefined;
  readonly loading: boolean;
  readonly transactions: GroupedTransactions[];
  readonly onFetchMore: () => void;
  readonly onRefresh: () => void;
}

const TransactionsList = (props: TransactionsListProps) => {
  const { loading, transactions, onFetchMore, onRefresh, headerComponent, emptyComponent } = props;
  const styles = useStyles();
  const theme = useTheme();
  const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = useState(false);
  const sections = transactions.flatMap((enty) => [enty.date, ...enty.transactions, 'divider']);

  const renderItem = useCallback(
    ({ item, index }) => {
      if (typeof item === 'string') {
        if (item === 'divider') {
          return <View style={styles.blankDivider} />;
        }
        return <TransactionsListSectionHeader date={item} />;
      }
      return <TransactionsListItem index={index} transaction={item} sectionLength={0} />;
    },
    [styles.blankDivider],
  );

  // Disable the sticky header since there is a bug in FlashList that causes
  // the first element to not update correctly when the date changes.
  // See: https://github.com/Shopify/flash-list/issues/615
  // const stickyHeaderIndices = sections
  //   .map((item, index) => {
  //     if (typeof item === 'string') {
  //       return index;
  //     }
  //     return null;
  //   })
  //   .filter((item) => item !== null) as number[];

  return (
    <FlashList
      ListHeaderComponent={headerComponent}
      ListEmptyComponent={emptyComponent}
      data={sections}
      renderItem={renderItem}
      keyExtractor={(item, index) =>
        typeof item === 'string' ? `sectionHeader${index}` : `row${item.hash}`
      }
      onMomentumScrollBegin={() => setOnEndReachedCalledDuringMomentum(false)}
      onEndReached={() => {
        if (!onEndReachedCalledDuringMomentum) {
          onFetchMore();
          setOnEndReachedCalledDuringMomentum(true);
        }
      }}
      onEndReachedThreshold={0.5}
      getItemType={(item) => (typeof item === 'string' ? 'sectionHeader' : 'row')}
      refreshControl={
        <RefreshControl
          tintColor={theme.colors.primary}
          colors={[theme.colors.primary]}
          enabled
          refreshing={loading}
          onRefresh={onRefresh}
        />
      }
      showsVerticalScrollIndicator
      estimatedItemSize={60}
    />
  );
};

export default TransactionsList;
