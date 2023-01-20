import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.roundness,
    backgroundColor: theme.colors.background,
    padding: 16,
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
    width: 25,
    height: 25,
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
  array: {
    fontStyle: 'italic',
  },
}));

export default useStyles;
