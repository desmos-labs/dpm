import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  bioContainer: {
    marginHorizontal: theme.spacing.m,
  },
  bioText: {
    overflow: 'hidden',
    fontStyle: 'italic',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    flexGrow: 1,
    alignItems: 'flex-start',
    paddingHorizontal: theme.spacing.m,
  },
  linksContainer: {
    flex: 1,
    width: '100%',
  },
}));

export default useStyles;
