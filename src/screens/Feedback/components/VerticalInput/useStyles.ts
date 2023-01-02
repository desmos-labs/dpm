import {makeStyle} from 'config/theme';

const useStyles = makeStyle((theme) => ({
  container: {
    paddingVertical: theme.spacing.s,
  },
  label: {
    paddingBottom: theme.spacing.s,
  },
  input: {
    paddingVertical: theme.spacing.s,
    borderRadius: 4,
    backgroundColor: theme.colors.surface,
    color: theme.colors.font['1'],
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 21,
    letterSpacing: 0.0025,
    textAlign: 'left',
  },
  errorLabel: {
    color: theme.colors.error,
  },
}));

export default useStyles;
