import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  selectedWordsContainer: {
    marginTop: theme.spacing.s,
    minHeight: '20%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: theme.roundness,
    borderColor: theme.colors.surface,
  },
  selectedWordsContainerError: {
    borderColor: theme.colors.feedbackError,
  },
  selectedWords: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  availableWordsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing.s,
  },
  wordBadge: {
    margin: theme.spacing.s,
  },
}));

export default useStyles;
