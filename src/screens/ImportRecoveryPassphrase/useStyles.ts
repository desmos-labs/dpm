import {makeStyle} from 'theming';

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
    marginBottom: theme.spacing.xs,
    color: theme.colors.font.red,
  },
  nextBtn: {
    marginVertical: theme.spacing.xs,
  },
}));

export default useStyles;
