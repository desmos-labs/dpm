import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  generatingText: {},
  icon: {
    height: 180,
  },
  continueButton: {
    alignSelf: 'auto',
    marginVertical: theme.spacing.s,
  },
  errorText: {
    color: theme.colors.error,
  },
}));

export default useStyles;
