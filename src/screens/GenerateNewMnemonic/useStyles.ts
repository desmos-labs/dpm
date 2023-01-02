import {makeStyle} from 'config/theme';
import Colors from 'constants/colors';

const useStyles = makeStyle((theme) => ({
  root: {
    paddingTop: 0,
  },
  loadingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveMnemonicAdvice: {
    marginTop: theme.spacing.s,
  },
  saveMnemonicAdviceSubtitle: {
    color: Colors.DesmosOrange,
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
