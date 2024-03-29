import { makeStyleWithProps } from 'config/theme';
import { ProfileHeaderProps } from 'components/ProfileHeader/index';

const useStyles = makeStyleWithProps((props: ProfileHeaderProps, theme) => ({
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
    opacity: props.coverPictureUploading ? 0.5 : 1,
  },
  coverPictureActivityIndicator: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    width: '100%',
    height: '100%',
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
  },
  addressContainer: {
    width: 100,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
}));

export default useStyles;
