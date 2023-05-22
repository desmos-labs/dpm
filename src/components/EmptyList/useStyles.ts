import { makeStyle } from 'config/theme';

const useStyles = makeStyle(() => ({
  root: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    width: 72,
    height: 72,
  },
}));

export default useStyles;
