import { makeStyle } from 'config/theme';

const useStyles = makeStyle(() => ({
  container: { flex: 1, paddingTop: 16 },
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
