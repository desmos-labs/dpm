import { gql } from '@apollo/client';
import TransactionFields from './fragments/TransactionFields';

/**
 * @example
 * const { data, loading, error } = useQuery(GetTransactionsByAddress, {
 *   variables: {
 *      addresses: // value for 'address'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *      types: // value for 'types'
 *   },
 * });
 */
const GetTransactionsByAddress = gql`
  ${TransactionFields}
  query Transactions(
    $addresses: _text
    $limit: bigint = 20
    $offset: bigint = 0
    $types: _text = "{}"
  ) @api(name: forbole) {
    messages: messages_by_address(
      args: { addresses: $addresses, types: $types, limit: $limit, offset: $offset }
      where: { index: { _eq: "0" } }
    ) {
      transaction {
        ...TransactionFields
      }
    }
  }
`;

export default GetTransactionsByAddress;
