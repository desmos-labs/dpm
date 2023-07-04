import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  selectedWordsContainer: {
    minHeight: '35%',
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
  errorMessageContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.s,
  },
  errorParagraph: {
    color: theme.colors.feedbackError,
    marginLeft: theme.spacing.s,
    marginTop: 2,
  },
  errorImage: {
    width: 20,
    height: 20,
  },
}));

export default useStyles;
