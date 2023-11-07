import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  noPermissionsContainer: {
    backgroundColor: theme.colors.background,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  indicatorView: { flex: 1, justifyContent: 'center' },
}));

export default useStyles;
