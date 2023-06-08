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
    backgroundColor: theme.colors.surface,
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