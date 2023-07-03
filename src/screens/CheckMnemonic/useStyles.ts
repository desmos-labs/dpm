import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    paddingTop: 0,
    display: 'flex',
    flexDirection: 'column',
  },
  selectedWordsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing.s,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: theme.roundness,
    borderColor: theme.colors.surface,
    flexGrow: 1,
    maxHeight: '50%',
  },
  selectedWordsContainerError: {
    borderColor: theme.colors.feedbackError,
  },
  availableWordsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing.s,
    flexGrow: 1,
  },
  wordBadge: {
    marginTop: theme.spacing.s,
    marginLeft: theme.spacing.s,
    marginRight: theme.spacing.s,
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
