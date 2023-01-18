import { makeStyle } from 'config/theme';

const useStyles = makeStyle(() => ({
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
  debugUri: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  pairingIndicator: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(200, 200, 200, 0.8)',
  },
}));

export default useStyles;
