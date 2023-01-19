import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  view: {
    position: 'absolute',
    zIndex: 1,
    backgroundColor: theme.colors.background,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
  textContainer: {
    padding: theme.spacing.s,
  },
}));

export default useStyles;
