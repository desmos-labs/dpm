import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
  },
  icon: {
    marginTop: 2,
    width: 20,
    height: 20,
  },
  text: {
    marginStart: theme.spacing.s,
    color: theme.colors.error,
  },
}));

export default useStyles;
