import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    minWidth: '90%',
  },
  title: {
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    marginTop: 8,
  },
  buttonsRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: theme.spacing.m,
  },
  centred: {
    alignSelf: 'center',
  },
}));

export default useStyles;
