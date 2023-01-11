import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
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
  profileDataContainer: {
    marginTop: -70,
    marginStart: theme.spacing.m,
  },
  profilePictureContainer: {
    marginStart: theme.spacing.m,
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
    fontWeight: 'bold',
    fontSize: 22,
    lineHeight: 26,
    letterSpacing: 0.0015,
    color: theme.colors.primary,
    marginTop: 16,
  },
  addressContainer: {
    width: 100,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
}));

export default useStyles;
