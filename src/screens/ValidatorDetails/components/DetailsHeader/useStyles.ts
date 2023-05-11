import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  details: {
    marginLeft: theme.spacing.m,
  },
}));

export default useStyles;
