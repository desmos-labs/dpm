import {makeStyle} from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.colors.popupBackground,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: theme.colors.popupSurface,
    elevation: 4,
    borderRadius: theme.roundness,
    padding: theme.spacing.l,
    alignItems: 'center',
  },
  successImage: {
    width: 200,
    height: 100,
  },
}));

export default useStyles;
