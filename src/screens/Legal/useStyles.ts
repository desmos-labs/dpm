import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  background: {
    backgroundColor: theme.colors.background2,
  },
  title: {
    marginBottom: theme.spacing.s,
  },
  section: {
    marginTop: theme.spacing.l,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: theme.roundness,
    borderColor: theme.colors.line,
  },
}));

export default useStyles;
