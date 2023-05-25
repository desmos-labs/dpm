import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '80%',
    paddingTop: theme.spacing.m,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    marginTop: theme.spacing.xs,
  },
  list: {
    flex: 1,
  },
}));

export default useStyles;
