import { TouchableOpacity, View } from 'react-native';
import React, { useCallback } from 'react';
import { Transaction } from 'types/transactions';
import { useNavigation } from '@react-navigation/native';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import ROUTES from 'navigation/routes';
import Typography from 'components/Typography';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import Flexible from 'components/Flexible';
import Spacer from 'components/Spacer';
import Badge from 'components/Badge';
import { formatCoin } from 'lib/FormatUtils';
import { coin } from '@cosmjs/amino';
import useMessageName from 'hooks/messages/useMessageName';
import useStyles from './useStyles';

export interface TransactionsListItemProps {
  readonly transaction: Transaction;
}

const TransactionsListItem = (props: TransactionsListItemProps) => {
  const navigation = useNavigation<StackNavigationProp<RootNavigatorParamList>>();
  const { t } = useTranslation('transaction');
  const { transaction } = props;
  const styles = useStyles();

  // -------- VARIABLES --------

  const txDate = React.useMemo(() => new Date(transaction.timestamp), [transaction.timestamp]);

  const badgeLabel = useMessageName(transaction.messages[0]);

  const amount = React.useMemo(
    // TODO: Implement the logic to resolve the transaction amount.
    () => formatCoin(coin('10000', 'udaric')),
    [],
  );

  // -------- CALLBACKS --------

  const onPress = useCallback(() => {
    navigation.navigate(ROUTES.TRANSACTION_DETAILS, {
      transaction,
    });
  }, [navigation, transaction]);

  return (
    <TouchableOpacity onPress={onPress}>
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
