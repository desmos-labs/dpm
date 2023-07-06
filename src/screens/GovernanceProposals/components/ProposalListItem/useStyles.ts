import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: theme.roundness,
  },
  proposalHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  proposalTitle: {
    color: theme.colors.primary,
  },
  proposalDescription: {
    maxHeight: 100,
  },
}));

export default useStyles;
