import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    flex: 1,
    backgroundColor: theme.colors.popupBackground,
    display: 'flex',
    flexDirection: 'column',
  },
  centredRoot: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: '10%',
  },
  bottomRoot: {
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: theme.colors.popupSurface,
    elevation: 4,
  },
  centredContent: {
    borderRadius: theme.roundness,
    padding: theme.spacing.l,
    alignItems: 'center',
  },
  bottomContent: {
    borderTopLeftRadius: theme.roundness,
    borderTopRightRadius: theme.roundness,
    padding: theme.spacing.l,
  },
  closePopupArea: {
    flex: 1,
  },
}));

export default useStyles;
