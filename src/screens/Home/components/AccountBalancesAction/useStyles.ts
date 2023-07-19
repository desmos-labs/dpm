import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  actionContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'flex-start',
    padding: theme.spacing.m,
    borderRadius: theme.roundness,
    backgroundColor: theme.colors.background,
    marginHorizontal: theme.spacing.xs,

    // Shadows
    shadowColor: 'rgba(10, 10, 10, 0.05)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 20,
    elevation: 20,
    shadowOpacity: 1,
  },
  actionValues: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },
  button: {
    minWidth: 100,
  },
}));

export default useStyles;
