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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
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
