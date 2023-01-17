import { makeStyle } from 'config/theme';

const useStyles = makeStyle((_) => ({
  txHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 12,
  },
  txIcon: {
    width: 34,
    height: 34,
  },
  headerAmount: {
    marginTop: 10,
  },
}));

export default useStyles;
