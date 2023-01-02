import {makeStyle} from 'config/theme';

const useStyles = makeStyle((theme) => ({
  topBar: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  },
  profileHeaderDivider: {
    width: 63,
    alignSelf: 'flex-start',
    marginStart: 16,
    marginTop: 16,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flexGrow: 1,
    paddingHorizontal: theme.spacing.m,
  },
  bioContainer: {
    flex: 2,
  },
  bio: {
    marginTop: theme.spacing.s,
  },
  chainConnections: {
    flex: 3,
    marginTop: theme.spacing.s,
  },
  noProfileImage: {
    marginTop: 42,
    height: 140,
  },
  createProfileBtn: {
    marginTop: theme.spacing.m,
  },
}));

export default useStyles;
