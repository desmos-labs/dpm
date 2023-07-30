import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.m,
  },
  fields: {
    display: 'flex',
    marginStart: theme.spacing.m,
  },
}));

export default useStyles;
