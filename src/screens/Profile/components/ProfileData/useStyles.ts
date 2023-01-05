import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  bioContainer: {
    paddingHorizontal: theme.spacing.m,
    alignItems: 'center',
  },
  bioText: {
    marginTop: theme.spacing.s,
    overflow: 'hidden',
    fontStyle: 'italic',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.m,
    flexGrow: 1,
  },
}));

export default useStyles;
