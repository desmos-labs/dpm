import { formatDistance } from 'date-fns';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  RefreshControl,
  SectionList,
  SectionListRenderItemInfo,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import Colors from 'constants/colors';
import useFetchUserBalance from 'hooks/useFetchUserBalance';
import { ChainAccount } from 'types/chains';
import { BroadcastTx } from 'types/transaction';
import {
  SectionedTx,
  useFetchTxsGrouppedByDate,
} from 'components/TransactionsList/useHooks';
import Divider from 'components/Divider';
import DpmImage from 'components/DPMImage';
import Typography from 'components/Typography';
import { MessageListItem } from 'components/Messages/MessageListItem';
import useStyles from './useStyles';

export type TransactionsListProps = {
  chainAccount: ChainAccount;
  onTxPressed: (tx: BroadcastTx) => void;
  style?: StyleProp<ViewStyle>;
};

export const TransactionsList: React.FC<TransactionsListProps> = ({ chainAccount, style, onTxPressed }) => {
  const { txs, loading, fetchMore, refetchTxs } = useFetchTxsGrouppedByDate(chainAccount);
  const { t } = useTranslation();
  const styles = useStyles();
  const fetchBalance = useFetchUserBalance(chainAccount.address);

  const renderItem = useCallback(
    (info: SectionListRenderItemInfo<BroadcastTx, SectionedTx>) => {
      const begin = info.index === 0;
      const end = info.index === info.section.data.length - 1;
      const viewStyle: StyleProp<ViewStyle> = {
        borderTopLeftRadius: begin ? 8 : 0,
        borderTopRightRadius: begin ? 8 : 0,
        borderBottomLeftRadius: end ? 8 : 0,
        borderBottomRightRadius: end ? 8 : 0,
      };
      const txDate = new Date(info.item.timestamp);
      return (
        <View style={[styles.txMessage, viewStyle]}>
          {info.item.msgs.map((encodeObject, index, list) => {
            const showDivider = index < list.length - 1;
            return (
              <TouchableOpacity
                key={`msg-${info.index}-${index * 2}`}
                onPress={() => onTxPressed(info.item)}
              >
                <MessageListItem encodeObject={encodeObject} date={txDate} />
                {showDivider ? <Divider /> : null}
              </TouchableOpacity>
            );
          })}
        </View>
      );
    },
    [onTxPressed, styles.txMessage],
  );

  const reloadFromChain = useCallback(() => {
    refetchTxs().then(() => {
      fetchBalance(chainAccount.address);
    });
  }, [chainAccount.address, fetchBalance, refetchTxs]);

  return txs.length > 0 || loading ? (
    <SectionList
      style={style}
      sections={txs}
      stickySectionHeadersEnabled={false}
      renderItem={renderItem}
      renderSectionHeader={(info) => {
        const sectionDate = new Date(info.section.date);
        const currentDate = new Date();
        const todaySection =
          currentDate.getUTCDay() === sectionDate.getUTCDay() &&
          currentDate.getUTCMonth() === sectionDate.getUTCMonth() &&
          currentDate.getUTCFullYear() === sectionDate.getUTCFullYear();
        return (
          <Typography.Body style={styles.header}>
            {todaySection
              ? t('today')
              : formatDistance(sectionDate, currentDate, {
                  addSuffix: true,
                })}
          </Typography.Body>
        );
      }}
      renderSectionFooter={() => <View style={styles.footer} />}
      keyExtractor={(_, index) => index.toString()}
      onEndReached={fetchMore}
      onEndReachedThreshold={0.5}
      refreshControl={
        <RefreshControl
          enabled
          refreshing={loading}
          onRefresh={reloadFromChain}
          colors={[Colors.DesmosOrange]}
          tintColor={Colors.DesmosOrange}
        />
      }
      showsVerticalScrollIndicator
      ItemSeparatorComponent={Divider}
    />
  ) : (
    <View style={styles.noTransactionsView}>
      <DpmImage style={styles.noTransactionsImage} resizeMode="contain" source="no-transaction" />
      <Typography.Body1>{t('no transactions')}</Typography.Body1>
    </View>
  );
};

export default TransactionsList;
