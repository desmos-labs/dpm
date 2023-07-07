import { makeStyleWithProps } from 'config/theme';
import { Proposal, ProposalStatus } from 'types/proposals';

const useStyles = makeStyleWithProps((proposal: Proposal, theme) => ({
  resultBar: {
    color:
      proposal.status === ProposalStatus.Rejected
        ? theme.colors.feedbackErrorBg
        : theme.colors.feedbackSuccessBg,
    borderColor:
      proposal.status === ProposalStatus.Rejected
        ? theme.colors.feedbackError
        : theme.colors.feedbackSuccess,
  },
  resultsContainer: {
    backgroundColor: theme.colors.neutral100,
    padding: theme.spacing.m,
    borderRadius: theme.roundness,
  },
  finalResultsContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  finalResultText: {
    color:
      proposal.status === ProposalStatus.Rejected
        ? theme.colors.feedbackError
        : theme.colors.feedbackSuccess,
  },
}));

export default useStyles;
