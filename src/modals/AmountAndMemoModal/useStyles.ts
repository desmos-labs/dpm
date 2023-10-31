import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    paddingBottom: theme.spacing.l,
  },
  title: {
    alignSelf: 'center',
  },
}));

export default useStyles;
