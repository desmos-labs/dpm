import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  footer: {
    paddingBottom: 16,
  },
  blankDivider: { marginVertical: theme.spacing.s },
}));

export default useStyles;
