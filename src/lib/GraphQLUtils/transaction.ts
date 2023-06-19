import { GQLMessage, GQLTransactionFee, Transaction } from 'types/transactions';
import decodeGqlRawMessage from 'lib/GraphQLUtils/message';
import { StdFee } from '@cosmjs/amino';

/**
 * Function to convert a transaction fee obtained from GraphQL into
 * a {@link StdFee} object that the application can handel.
 * @param gqlFee - The transaction fee obtained from GraphQL.
 */
export const convertGqlFee = (gqlFee: GQLTransactionFee): StdFee => ({
  gas: gqlFee.gas_limit,
  amount: gqlFee.amount,
  payer: gqlFee.payer,
  granter: gqlFee.granter,
});

/**
 * Function to convert a message with its transaction obtained from GraphQL into
 * a {@link Transaction} object that the application can handle.
 * @param gqlMessage - The message obtained form GraphQL.
 */
export const convertGqlMessageToTransaction = (gqlMessage: GQLMessage): Transaction => ({
  messages: gqlMessage.transaction.messages?.map(decodeGqlRawMessage),
  hash: gqlMessage.transaction.hash,
  success: gqlMessage.transaction.success,
  timestamp: gqlMessage.transaction.block.timestamp,
  fee: convertGqlFee(gqlMessage.transaction.fee),
  memo: gqlMessage.transaction.memo,
});
