import {makeStyle} from 'theming';

const useStyles = makeStyle((theme) => ({
  mnemonicInputLabel: {
    marginTop: theme.spacing.l,
    textTransform: 'capitalize',
  },
  mnemonicInput: {
    marginTop: theme.spacing.s,
    minHeight: 150,
  },
  advanceSettingsBtn: {
    marginTop: theme.spacing.s,
  },
  errorParagraph: {
    marginBottom: theme.spacing.s,
    color: theme.colors.font.red,
  },
}));

export default useStyles;
