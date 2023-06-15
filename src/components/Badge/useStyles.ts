import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    backgroundColor: `${theme.colors.primary}10`,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: theme.roundness,
  },
  text: {
    color: theme.colors.primary,
  },
}));

export default useStyles;
