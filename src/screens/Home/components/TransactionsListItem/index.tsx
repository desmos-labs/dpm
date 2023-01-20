import { TouchableOpacity, View } from 'react-native';
import MessageListItem from 'components/Messages/MessageListItem';
import Divider from 'components/Divider';
import React, { useCallback } from 'react';
import { Transaction } from 'types/transactions';
import { useNavigation } from '@react-navigation/native';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import ROUTES from 'navigation/routes';
import useStyles from './useStyles';

export interface TransactionsListItemProps {
  readonly index: number;
  readonly transaction: Transaction;
  readonly sectionLength: number;
}

const TransactionsListItem = (props: TransactionsListItemProps) => {
  const navigation = useNavigation<StackNavigationProp<RootNavigatorParamList>>();
  const { index, transaction, sectionLength } = props;
  const styles = useStyles(index === 0, index === sectionLength - 1);

  const txDate = new Date(transaction.timestamp);
  const onPress = useCallback(() => {
    navigation.navigate(ROUTES.TRANSACTION_DETAILS, {
      transaction,
    });
  }, [navigation, transaction]);

  return (
    <View style={styles.root}>
      {transaction?.messages?.map((message, msgIndex, list) => {
        const showDivider = msgIndex < list.length - 1;
        return (
          <TouchableOpacity key={`msg-${index}-${msgIndex * 2}`} onPress={onPress}>
            <MessageListItem message={message} date={txDate} />
            {showDivider ? <Divider /> : null}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default TransactionsListItem;
