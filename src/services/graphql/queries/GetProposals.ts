import { gql } from '@apollo/client';
import ProposalFields from 'services/graphql/queries/fragments/ProposalFields';

/**
 * Gets the list of proposals.
 * @example
 * const { data, loading, error } = useQuery(GetProposals, {
 *   variables: {
 *      offset: // Offset value
 *      limit: // Number of items to fetch
 *   },
 * });
 */
const GetProposals = gql`
  ${ProposalFields}
  query GetProposals($offset: Int = 0, $limit: Int = 100) @api(name: forbole) {
    proposal(order_by: { id: desc }, limit: $limit, offset: $offset) {
      ...ProposalFields
    }
  }
`;

export default GetProposals;
