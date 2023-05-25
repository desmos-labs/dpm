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
    paddingHorizontal: theme.spacing.l,
    paddingBottom: theme.spacing.l,
  },
  successImage: {
    width: 200,
    height: 100,
  },
  closePopupArea: {
    flex: 1,
  },
}));

export default useStyles;
