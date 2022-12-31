import {makeStyle} from 'theming';

const useStyles = makeStyle((theme) => ({
  root: {
    minWidth: '60%',
    maxWidth: '70%',
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
