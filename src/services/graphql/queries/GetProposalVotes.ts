import { gql } from '@apollo/client';

/**
 * Gets the list of votes of a proposal.
 * @example
 * const { data, loading, error } = useQuery(GetProposalVotes, {
 *   variables: {
 *      proposalId: // Proposal id
 *      offset: // Offset value
 *      limit: // Number of items to fetch
 *   },
 * });
 */
const GetProposalVotes = gql`
  query GetProposalVotes($proposalId: Int, $limit: Int = 100, $offset: Int = 0)
  @api(name: forbole) {
    proposalVotes: proposal_vote(
      where: { proposal_id: { _eq: $proposalId } }
      limit: $limit
      offset: $offset
      order_by: { height: desc }
    ) {
      voterAddress: voter_address
      option
    }
  }
`;

export default GetProposalVotes;
