import { makeStyle } from 'config/theme';

const useStyles = makeStyle(() => ({
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
