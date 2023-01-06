import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.colors.surface2,
  },
}));

export default useStyles;
