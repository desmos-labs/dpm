import { makeStyle } from 'config/theme';

const useStyles = makeStyle(() => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
}));

export default useStyles;
