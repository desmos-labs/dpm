import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  loadingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveMnemonicAdvice: {
    marginTop: theme.spacing.s,
  },
  saveMnemonicAdviceSubtitle: {
    fontFamily: 'Poppins-Bold',
    fontWeight: 'bold',
  },
  mnemonic: {
    marginTop: theme.spacing.m,
    flex: 1,
  },
  wordsBtnContainer: {
    display: 'flex',
    flexDirection: 'row-reverse',
  },
  saveButton: {
    fontStyle: 'normal',
    textTransform: 'none',
  },
}));

export default useStyles;
