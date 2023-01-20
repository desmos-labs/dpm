import { makeStyle } from 'config/theme';

const useStyle = makeStyle((theme) => ({
  background: {
    backgroundColor: theme.colors.background2,
  },
  topMargin: {
    paddingVertical: theme.spacing.xl,
    marginTop: theme.spacing.l,
  },
}));

export default useStyle;
