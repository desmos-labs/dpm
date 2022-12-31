import {makeStyle} from 'theming';

const useStyles = makeStyle((theme) => ({
  header: {
    paddingBottom: 8,
    color: theme.colors.font['2'],
    textTransform: 'capitalize',
  },
  footer: {
    paddingBottom: 16,
  },
  txMessage: {
    backgroundColor: theme.colors.surface2,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  noTransactionsView: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
  },
  noTransactionsImage: {
    marginTop: 42,
    height: 180,
  },
}));

export default useStyles;
