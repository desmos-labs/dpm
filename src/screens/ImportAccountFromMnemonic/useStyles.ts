import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  mnemonicInputLabel: {
    marginTop: theme.spacing.l,
    textTransform: 'capitalize',
  },
  mnemonic: {
    marginTop: theme.spacing.s,
    minHeight: 110,
  },
  mnemonicInput: {
    height: '100%',
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
