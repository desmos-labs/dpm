import { makeStyle } from 'config/theme';

const useStyles = makeStyle(() => ({
  container: { flex: 1, paddingTop: 16 },
  totalRestaking: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalDelegateddAmount: {
    fontWeight: 'bold',
  },
}));

export default useStyles;
