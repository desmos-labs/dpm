import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  chainItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.s,
    borderRadius: theme.roundness,
  },
  chainLogo: {
    width: 32,
    height: 32,
  },
  chainLinkName: {
    marginLeft: theme.spacing.s,
  },
}));

export default useStyles;
