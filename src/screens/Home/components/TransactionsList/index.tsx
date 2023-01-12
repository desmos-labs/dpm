import {
  RefreshControl,
  SectionList,
  SectionListRenderItemInfo,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import Divider from 'components/Divider';
import React, { useCallback, useState } from 'react';
import { GroupedTransactions, Transaction } from 'types/transactions';
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
  const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = useState(false);
  const sections = transactions?.map((enty) => ({ date: enty.date, data: enty.transactions }));

  const renderItem = useCallback(
    (info: SectionListRenderItemInfo<Transaction>) => (
      <TransactionsListItem
        index={info.index}
        transaction={info.item}
        sectionLength={info.section.data.length}
      />
    ),
    [],
  );

  return (
    sections && (
      <SectionList
        style={style}
        sections={sections}
        stickySectionHeadersEnabled={true}
        renderItem={renderItem}
        renderSectionHeader={(info) => <TransactionsListSectionHeader date={info.section.date} />}
        renderSectionFooter={() => <View style={styles.footer} />}
        keyExtractor={(item, index) => item.hash + index}
        onMomentumScrollBegin={() => setOnEndReachedCalledDuringMomentum(false)}
        onEndReached={() => {
          if (!onEndReachedCalledDuringMomentum) {
            onFetchMore();
            setOnEndReachedCalledDuringMomentum(true);
          }
        }}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            enabled
            refreshing={loading}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        showsVerticalScrollIndicator
        ItemSeparatorComponent={Divider}
      />
    )
  );
};

export default TransactionsList;
