import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  topBarTitle: {
    color: theme.colors.text,
  },
  content: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },
}));

export default useStyles;
