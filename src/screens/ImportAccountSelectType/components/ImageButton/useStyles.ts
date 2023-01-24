import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing.s,
    backgroundColor: theme.colors.surface2,
    elevation: 5,
    borderRadius: theme.roundness,
    marginHorizontal: theme.spacing.s,
  },
}));

export default useStyles;
