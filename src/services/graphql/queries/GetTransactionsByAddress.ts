import { gql } from '@apollo/client';

/**
 * @example
 * const { data, loading, error } = useQuery(GetTransactionsByAddress, {
 *   variables: {
 *      address: // value for 'address'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *      types: // value for 'types'
 *   },
 * });
 */
const GetTransactionsByAddress = gql`
  query Transactions(
    $address: _text
    $limit: bigint = 20
    $offset: bigint = 0
    $types: _text = "{}"
  ) @api(name: forbole) {
    messages: messages_by_address(
      args: { addresses: $address, types: $types, limit: $limit, offset: $offset }
    ) {
      index
      type
      value
      transaction {
        hash
        success
        block {
          timestamp
        }
      }
    }
  }
`;

export default GetTransactionsByAddress;
