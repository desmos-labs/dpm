import { makeStyle } from 'config/theme';

const useStyles = makeStyle(() => ({
  totalStaked: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
}));

export default useStyles;
