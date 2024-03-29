import { makeStyle } from 'config/theme';

const useStyles = makeStyle(() => ({
  root: {},
  title: {
    fontWeight: 'bold',
  },
  applicationLinksContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  applicationLinkContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
}));

export default useStyles;
