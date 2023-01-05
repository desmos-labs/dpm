import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    margin: 0,
  },
  topRight: {
    position: 'absolute',
    zIndex: 1,
    top: 0,
    right: 0,
  },
  topLeft: {
    position: 'absolute',
    zIndex: 1,
    top: 0,
    left: 0,
  },
  coverPictureContainer: {
    width: '100%',
  },
  coverPicture: {
    width: '100%',
    height: 200,
  },
  editCoverPictureBtn: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 2,
  },
  profilePictureContainer: {
    marginTop: -70,
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editProfilePictureBtn: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 2,
  },
  nickName: {
    fontWeight: '500',
    fontSize: 22,
    lineHeight: 26,
    letterSpacing: 0.0015,
    color: theme.colors.primary,
    marginTop: 16,
  },
  dtag: {
    marginTop: 6,
  },
  addressContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginHorizontal: 32,
    alignItems: 'center',
  },
}));

export default useStyles;
