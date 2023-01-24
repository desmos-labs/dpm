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
  imageStyle: {
    width: '100%',
    height: 100,
  },
}));

export default useStyles;
