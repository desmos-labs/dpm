import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  title: {
    alignSelf: 'center',
  },
  voteOptionsContainer: {
    marginTop: 24,
    marginBottom: 40,
  },
  voteOption: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
  },
  voteOptionIcon: {
    width: 24,
    height: 24,
    marginEnd: 8,
  },
  selectedOptionText: {
    color: '#FFFFFF',
  },
  positiveSelected: {
    backgroundColor: theme.colors.feedbackSuccess,
  },
  negativeSelected: {
    backgroundColor: theme.colors.feedbackError,
  },
  neutralSelected: {
    backgroundColor: theme.colors.primary,
  },
}));

export default useStyles;
