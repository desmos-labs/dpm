import { makeStyle } from 'config/theme';

const useStyle = makeStyle((theme) => ({
  background: {
    backgroundColor: theme.colors.background2,
  },
  topMargin: {
    marginTop: theme.spacing.l,
  },
  bottomMargin: {
    paddingVertical: theme.spacing.xl,
    marginBottom: theme.spacing.l,
  },
}));

export default useStyle;
