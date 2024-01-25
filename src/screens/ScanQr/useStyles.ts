import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  camera: {
    alignSelf: 'center',
    width: '100%',
  },
  backButton: {
    backgroundColor: '#fff',
    position: 'absolute',
    top: 40,
    left: 8,
    elevation: 9,
    zIndex: 99,
  },
  pasteUri: {
    position: 'absolute',
    bottom: theme.spacing.m,
    left: 0,
    right: 0,
  },
  pairingIndicator: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
}));

export default useStyles;
