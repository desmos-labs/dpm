import { GQLMessage, GQLTransactionFee, Transaction } from 'types/transactions';
import decodeGqlRawMessage from 'lib/GraphQLUtils/message';
import { StdFee } from '@cosmjs/amino';

export const convertGqlFee = (gqlFee: GQLTransactionFee): StdFee => ({
  gas: gqlFee.gas_limit,
  amount: gqlFee.amount,
  payer: gqlFee.payer,
  granter: gqlFee.granter,
});

export const convertGqlMessageToTransaction = (gqlMessage: GQLMessage): Transaction => ({
  messages: gqlMessage.transaction.messages?.map(decodeGqlRawMessage),
  hash: gqlMessage.transaction.hash,
  success: gqlMessage.transaction.success,
  timestamp: gqlMessage.transaction.block.timestamp,
  fee: convertGqlFee(gqlMessage.transaction.fee),
});
