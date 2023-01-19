import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  chainLinkItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  chainLinkIcon: {
    width: 32,
    height: 32,
  },
  chainLinkInfo: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: theme.spacing.s,
  },
  chainLinkName: {
    textTransform: 'capitalize',
  },
}));

export default useStyles;
