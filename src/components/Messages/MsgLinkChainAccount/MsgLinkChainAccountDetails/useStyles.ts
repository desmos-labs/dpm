import { makeStyle } from 'config/theme';

const useStyles = makeStyle((_) => ({
  chainLinkIcon: {
    height: 44,
    width: 44,
  },
  customIconView: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  disconnectIcon: {
    height: 24,
    marginHorizontal: 20,
    width: 24,
  },
}));

export default useStyles;
