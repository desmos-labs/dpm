import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.roundness,
    backgroundColor: theme.colors.background,
    padding: 16,
    // Margin to allow the visualization of the shadows
    margin: 4,
    // Shadows
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
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
  date: {
    fontStyle: 'italic',
  },
}));

export default useStyles;
