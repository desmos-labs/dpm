import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  noPermissionsContainer: {
    backgroundColor: theme.colors.background,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
}));

export default useStyles;
