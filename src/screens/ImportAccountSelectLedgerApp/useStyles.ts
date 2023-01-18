import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  background: {
    backgroundColor: theme.colors.background2,
  },
  appList: {
    marginTop: theme.spacing.m,
  },
}));

export default useStyles;
