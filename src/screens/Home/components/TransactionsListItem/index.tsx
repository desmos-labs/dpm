import { TouchableOpacity, View } from 'react-native';
import MessageListItem from 'components/Messages/MessageListItem';
import Divider from 'components/Divider';
import React from 'react';
import { Transaction } from 'types/transactions';
import useStyles from './useStyles';

export interface TransactionsListItemProps {
  readonly index: number;
  readonly transaction: Transaction;
  readonly sectionLength: number;
}

const TransactionsListItem = (props: TransactionsListItemProps) => {
  const { index, transaction, sectionLength } = props;
  const styles = useStyles(index === 0, index === sectionLength - 1);

  const txDate = new Date(transaction.timestamp);
  const onPress = (msgIndex: number) => () => {
    console.log('Transaction pressed', transaction.hash, msgIndex);
  };

  return (
    <View style={styles.root}>
      {transaction.messages.map((encodeObject, msgIndex, list) => {
        const showDivider = msgIndex < list.length - 1;
        return (
          <TouchableOpacity key={`msg-${index}-${msgIndex * 2}`} onPress={onPress(msgIndex)}>
            <MessageListItem encodeObject={encodeObject} date={txDate} />
            {showDivider ? <Divider /> : null}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default TransactionsListItem;
