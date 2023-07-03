import { makeStyle } from 'config/theme';

const useStyles = makeStyle(() => ({
  image: {
    width: 121,
    height: 121,
    alignSelf: 'center',
  },
  centeredText: {
    textAlign: 'center',
  },
}));

export default useStyles;
