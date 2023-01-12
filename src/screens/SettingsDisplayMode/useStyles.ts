import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  background: {
    backgroundColor: theme.colors.background2,
  },
  sectionMargin: {
    marginTop: theme.spacing.l,
  },
  topBarTitle: {
    color: theme.colors.text,
  },
}));

export default useStyles;
