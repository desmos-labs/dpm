import { makeStyle } from 'config/theme';

const useStyles = makeStyle(() => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
  },
}));

export default useStyles;
