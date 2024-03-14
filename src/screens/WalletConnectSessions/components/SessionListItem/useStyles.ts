import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.roundness,
    backgroundColor: theme.colors.background,
    padding: 16,
    // Shadows
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 20,
    elevation: 8,
    shadowOpacity: 1,
  },
  details: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  title: {
    display: 'flex',
    flexDirection: 'row',
  },
  icon: {
    width: 24,
    height: 24,
  },
  texts: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  appName: {
    fontWeight: 'bold',
  },
  permissions: {
    textAlign: 'center',
  },
  date: {
    fontStyle: 'italic',
  },
}));

export default useStyles;
