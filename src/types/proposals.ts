/**
 * Enum that represents the status of a {@link Proposal}.
 */
export enum ProposalStatus {
  Unspecified = 'PROPOSAL_STATUS_UNSPECIFIED',
  DepositPeriod = 'PROPOSAL_STATUS_DEPOSIT_PERIOD',
  VotingPeriod = 'PROPOSAL_STATUS_VOTING_PERIOD',
  Passed = 'PROPOSAL_STATUS_PASSED',
  Rejected = 'PROPOSAL_STATUS_REJECTED',
  Failed = 'PROPOSAL_STATUS_FAILED',
  Invalid = 'PROPOSAL_STATUS_INVALID',
  Unrecognized = 'UNRECOGNIZED',
}

/**
 * Interface that represents a governance proposal.
 */
export interface Proposal {
  readonly id: number;
  readonly title: string;
  readonly description: string;
  readonly status: ProposalStatus;
}

/**
 * Interface that represents the data returned from the
 * GQL GetProposals query.
 */
export interface GqlGetProposals {
  readonly proposal: Proposal[];
}
