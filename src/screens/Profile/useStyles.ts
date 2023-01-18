import { makeStyle } from 'config/theme';

const useStyles = makeStyle(() => ({
  topBar: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  },
}));

export default useStyles;
