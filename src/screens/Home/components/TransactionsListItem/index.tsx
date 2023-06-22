import { TouchableOpacity, View } from 'react-native';
import React, { useCallback } from 'react';
import { Transaction } from 'types/transactions';
import Typography from 'components/Typography';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import Flexible from 'components/Flexible';
import Spacer from 'components/Spacer';
import Badge from 'components/Badge';
import useMessageName from 'hooks/messages/useMessageName';
import useMessagesAmount from 'hooks/messages/useGetMessageAmount';
import useStyles from './useStyles';

export interface TransactionsListItemProps {
  /**
   * The transaction whose information will be displayed.
   */
  readonly transaction: Transaction;
  /**
   * Callback called when the user press on the transaction.
   */
  readonly onPress?: (t: Transaction) => any;
}

/**
 * Components that shows the information of a transaction.
 */
const TransactionsListItem: React.FC<TransactionsListItemProps> = ({ transaction, onPress }) => {
  const { t } = useTranslation('transaction');
  const styles = useStyles();

  // -------- VARIABLES --------

  const txDate = React.useMemo(() => new Date(transaction.timestamp), [transaction.timestamp]);

  const badgeLabel = useMessageName(transaction.messages[0]);

  const amount = useMessagesAmount(transaction.messages);

  // -------- CALLBACKS --------

  const onItemPress = useCallback(() => {
    if (onPress !== undefined) {
      onPress(transaction);
    }
  }, [onPress, transaction]);

  return (
    <TouchableOpacity onPress={onItemPress} disabled={onPress === undefined}>
      <View style={styles.root}>
        {/* Header */}
        <View style={styles.header}>
          {/* Tx Hash */}
          <Typography.Regular14
            style={styles.transactionHash}
            numberOfLines={1}
            ellipsizeMode={'middle'}
          >
            {transaction.hash}
          </Typography.Regular14>

          <Flexible.Padding flex={1} />

          {/* Information about the messages inside the transaction */}
          <Badge text={badgeLabel} capitalize />
          {transaction.messages.length > 1 && (
            <Typography.Regular10 style={styles.msgCounter}>{`+${
              transaction.messages.length - 1
            }`}</Typography.Regular10>
          )}
        </View>

        <Spacer paddingVertical={8} />

        {/* Transaction amount */}
        <View style={styles.inlineField}>
          <Typography.Regular14 style={styles.fieldLabel}>{t('amount')}</Typography.Regular14>
          <Typography.SemiBold16>{amount}</Typography.SemiBold16>
        </View>

        <Spacer paddingVertical={4} />

        {/* Transaction execution timestamp */}
        <View style={styles.inlineField}>
          <Typography.Regular14 style={styles.fieldLabel}>{t('time')}</Typography.Regular14>
          <Typography.Regular14>{format(txDate, 'MMM dd, yyyy HH:mm:ss')}</Typography.Regular14>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default TransactionsListItem;
