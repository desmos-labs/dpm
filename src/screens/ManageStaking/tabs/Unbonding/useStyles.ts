import { makeStyle } from 'config/theme';

const useStyles = makeStyle(() => ({
  container: { flex: 1, paddingTop: 16 },
  totalUnbonding: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalUnbondingAmount: {
    fontWeight: 'bold',
  },
}));

export default useStyles;
