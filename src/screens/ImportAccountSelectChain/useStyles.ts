import { makeStyle } from 'config/theme';

const useStyle = makeStyle((theme) => ({
  background: {
    backgroundColor: theme.colors.background2,
  },
  list: {
    flex: 1,
  },
  bottomMargin: {
    marginTop: theme.spacing.l,
  },
}));

export default useStyle;
