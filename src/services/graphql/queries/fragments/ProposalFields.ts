import { gql } from '@apollo/client';

const ProposalFields = gql`
  fragment ProposalFields on proposal {
    id
    title
    description
    proposerAddress: proposer_address
    status
    content
    depositEndTime: deposit_end_time
    votingEndTime: voting_end_time
    votingStartTime: voting_start_time
    submitTime: submit_time
    proposalDeposits: proposal_deposits {
      amount
      depositorAddress: depositor_address
      height
      timestamp
    }
  }
`;

export default ProposalFields;
