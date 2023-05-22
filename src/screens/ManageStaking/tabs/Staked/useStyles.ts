import { makeStyle } from 'config/theme';

const useStyles = makeStyle(() => ({
  totalStaked: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalStakedAmount: {
    fontWeight: 'bold',
  },
}));

export default useStyles;
