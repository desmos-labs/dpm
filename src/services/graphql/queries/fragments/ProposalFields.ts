import { gql } from '@apollo/client';

const ProposalFields = gql`
  fragment ProposalFields on proposal {
    id
    title
    description
    status
  }
`;

export default ProposalFields;
