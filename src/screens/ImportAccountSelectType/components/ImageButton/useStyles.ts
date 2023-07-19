import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    backgroundColor: theme.colors.surface2,
    marginHorizontal: theme.spacing.s,
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
  image: {
    height: 24,
    width: 24,
  },
  label: {
    marginStart: 16,
  },
}));

export default useStyles;
