import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  txDetails: {
    flex: 1,
  },
  buttonsContainer: {
    marginVertical: theme.spacing.m,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    width: '40%',
  },
}));

export default useStyles;
