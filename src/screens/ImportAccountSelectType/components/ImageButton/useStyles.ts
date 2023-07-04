import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    backgroundColor: theme.colors.surface2,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderRadius: theme.roundness,
    marginHorizontal: theme.spacing.s,
  },
  image: {
    height: 24,
    width: 24,
  },
  label: {
    marginStart: 16,
  },
}));

export default useStyles;
