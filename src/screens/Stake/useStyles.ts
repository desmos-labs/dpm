import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  stakingMessageContainer: {
    padding: 4,
    // Add trailing 16 to make the 0.1 opacity
    backgroundColor: `${theme.colors.primary}16`,
    alignItems: 'center',
  },
  stakingMessage: {
    color: theme.colors.primary,
  },
  content: {
    display: 'flex',
    flex: 1,
    padding: theme.spacing.m,
  },
  validatorDetailsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.s,
    borderRadius: theme.roundness,
  },
  nextButton: {
    marginBottom: theme.spacing.xl,
  },
}));

export default useStyles;
