import { makeStyle } from 'config/theme';

const useStyles = makeStyle(() => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
}));

export default useStyles;
