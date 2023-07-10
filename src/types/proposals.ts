import { Coin } from '@desmoslabs/desmjs';

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

export interface ProposalDeposit {
  readonly amount: Coin[];
  readonly depositorAddress: string;
  readonly height: number;
  readonly timestamp: string;
}

export interface ProposalResults {
  readonly no: string;
  readonly noWithVeto: string;
  readonly yes: string;
  readonly abstain: string;
}

export interface ProposalContent extends Record<string, any> {
  readonly '@type': string;
}

/**
 * Interface that represents a governance proposal.
 */
export interface Proposal {
  readonly id: number;
  readonly title: string;
  readonly description: string;
  readonly proposerAddress: string;
  readonly status: ProposalStatus;
  readonly content: ProposalContent[] | ProposalContent;
  readonly depositEndTime: string;
  readonly votingEndTime: string;
  readonly votingStartTime: string;
  readonly submitTime: string;
  readonly proposalDeposits: ProposalDeposit[];
  readonly proposalResults: ProposalResults[];
}

/**
 * Interface that represents the data returned from the
 * GQL GetProposals query.
 */
export interface GqlGetProposals {
  readonly proposal: Proposal[];
}
