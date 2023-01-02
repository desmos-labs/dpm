import {makeStyle} from 'config/theme';

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
  errorParagraph: {
    marginBottom: theme.spacing.s,
    color: theme.colors.error,
  },
  saveButton: {},
}));

export default useStyles;
