import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    alignItems: 'center',
  },
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
}));

export default useStyles;
