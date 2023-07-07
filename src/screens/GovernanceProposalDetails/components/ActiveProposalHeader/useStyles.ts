import { makeStyleWithProps } from 'config/theme';
import { Proposal, ProposalStatus } from 'types/proposals';

const useStyles = makeStyleWithProps((proposal: Proposal, theme) => ({
  fieldsContainer: {
    backgroundColor:
      proposal.status === ProposalStatus.DepositPeriod
        ? theme.colors.secondary100
        : theme.colors.primary100,
    paddingHorizontal: theme.spacing.m,
    borderRadius: theme.roundness,
  },
  field: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.m,
  },
  divider: {
    height: 1,
    backgroundColor: '#FFFFFF',
  },
  button: {
    marginTop: theme.spacing.m,
    color:
      proposal.status === ProposalStatus.DepositPeriod ? theme.colors.accent : theme.colors.primary,
  },
}));

export default useStyles;
