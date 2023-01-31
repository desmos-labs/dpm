import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  topBar: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  },
  topBarButton: {
    color: theme.colors.icon['5'],
    backgroundColor: 'rgba(80, 80, 80, 0.4)',
  },
}));

export default useStyles;
