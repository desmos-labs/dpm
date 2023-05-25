import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '80%',
    paddingTop: theme.spacing.m,
  },
  header: {
    marginTop: theme.spacing.xs,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
}));

export default useStyles;
