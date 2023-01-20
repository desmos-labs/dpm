import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: theme.colors.surface2,
    padding: 8,
  },
  image: {
    marginTop: 6,
    width: 34,
    height: 34,
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  date: {
    color: theme.colors.font['3'],
  },
}));

export default useStyles;
