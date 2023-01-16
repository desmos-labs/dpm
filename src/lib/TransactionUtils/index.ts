import { GroupedTransactions, Transaction } from 'types/transactions';
import decodeQueriedMessage from 'lib/TransactionUtils/decoders';
import { Fee } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import Long from 'long';
import { QueriedMessage } from './types';

/**
 * Converts the given message data retrieved from the GraphQL APIs into a QueriedMessage object.
 * @param message - Message to be converted.
 */
const convertGQLMessage = (message: any): QueriedMessage => ({
  tx: {
    hash: message.transaction.hash,
    success: message.transaction.success,
    timestamp: message.transaction.block.timestamp,
    fee: message.transaction.fee,
    memo: message.transaction.memo,
  },
  index: message.index,
  type: message.type,
  value: message.value,
});

/**
 * Groups the given messages based on the same transaction hash.
 * @param messages - Messages queried from the GraphQL endpoint.
 * @return A map which entries represent the transaction hash and a list of associated QueriedMessage.
 */
const groupMessagesByTransaction = (messages: QueriedMessage[]) =>
  messages.reduce((group: Map<string, QueriedMessage[]>, message) => {
    const { tx } = message;
    const groupedMessages = group.get(tx.hash) || [];
    groupedMessages.push(message);
    group.set(tx.hash, groupedMessages);
    return group;
  }, new Map<string, QueriedMessage[]>([]));

/**
 * Groups the given transactions by their timestamp day.
 * @param transactions - List of transactions to be grouped.
 * @return A new map which entries represent a day and a list of associated transactions.
 */
const groupTransactionByDay = (transactions: Transaction[]) =>
  transactions.reduce((group: Map<string, Transaction[]>, transaction) => {
    const date = transaction.timestamp.split('T')[0]; // Group only by day
    const groupedTransactions = group.get(date) || [];
    groupedTransactions.push(transaction);
    group.set(date, groupedTransactions);
    return group;
  }, new Map<string, Transaction[]>([]));

const convertTxsResponse = (messages: any[]): GroupedTransactions[] => {
  const queriedMessages = messages.map(convertGQLMessage);
  const groupedMessages = groupMessagesByTransaction(queriedMessages);
  const transactions = Array.from(groupedMessages.entries()).map(([, transactionMessages]) => {
    const [firstMessage] = transactionMessages;
    const encodeObjects = transactionMessages.map(decodeQueriedMessage);
    const { fee } = firstMessage.tx;
    return {
      hash: firstMessage.tx.hash,
      success: firstMessage.tx.success,
      timestamp: firstMessage.tx.timestamp,
      messages: encodeObjects,
      memo: firstMessage.tx.memo,
      fee: fee
        ? ({
            amount: fee.amount,
            payer: fee.payer,
            granter: fee.granter,
            gasLimit: Long.fromString(fee.gas_limit),
          } as Fee)
        : undefined,
    } as Transaction;
  });

  const groupedTransactions = groupTransactionByDay(transactions);
  return Array.from(groupedTransactions.entries()).map(
    ([date, txs]) =>
      ({
        date,
        transactions: txs,
      } as GroupedTransactions),
  );
};

export default convertTxsResponse;
