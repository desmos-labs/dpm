import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    paddingTop: 0,
  },
  mnemonicInputLabel: {
    marginTop: theme.spacing.l,
    textTransform: 'capitalize',
  },
  mnemonicInput: {
    marginTop: theme.spacing.s,
    minHeight: 110,
  },
  advanceSettingsBtn: {
    marginTop: theme.spacing.s,
  },
  errorParagraph: {
    marginTop: theme.spacing.s,
    color: theme.colors.error,
  },
  nextBtn: {
    marginVertical: theme.spacing.xs,
  },
}));

export default useStyles;
