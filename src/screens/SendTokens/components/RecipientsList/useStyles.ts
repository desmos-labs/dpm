import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    zIndex: 99,
    position: 'absolute',
    backgroundColor: theme.colors.background,
    borderRadius: theme.roundness,

    // Shadows
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 20,
    elevation: 8,
    shadowOpacity: 1,
  },
}));

export default useStyles;
