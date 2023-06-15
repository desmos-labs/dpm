import { gql } from '@apollo/client';

const TransactionFields = gql`
  fragment TransactionFields on transaction {
    hash
    success
    fee
    block {
      timestamp
    }
    messages
  }
`;

export default TransactionFields;
