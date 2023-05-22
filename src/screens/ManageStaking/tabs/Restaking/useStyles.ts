import { makeStyle } from 'config/theme';

const useStyles = makeStyle(() => ({
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
