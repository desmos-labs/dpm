import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  infoContainer: {
    marginTop: theme.spacing.m,
    padding: theme.spacing.m,
    borderWidth: 1,
    borderColor: theme.colors.neutral300,
    borderRadius: theme.roundness,
  },
  txStatus: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  txStatusIcon: {
    width: 16,
    height: 16,
    marginEnd: theme.spacing.s,
  },
  txSuccessLabel: {
    color: theme.colors.feedbackSuccess,
  },
  txFailLabel: {
    color: theme.colors.feedbackError,
  },
}));

export default useStyles;
