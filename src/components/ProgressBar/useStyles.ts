import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    borderRadius: theme.roundness,
    borderColor: theme.colors.neutral200,
    borderWidth: 1,
    overflow: 'hidden',
    backgroundColor: theme.colors.background,
  },
  bar: {
    position: 'absolute',
    height: '100%',
    backgroundColor: theme.colors.neutral200,
  },
  text: {
    padding: theme.spacing.s,
  },
}));

export default useStyles;
