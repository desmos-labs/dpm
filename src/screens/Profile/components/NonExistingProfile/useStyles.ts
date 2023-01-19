import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  noProfileImage: {
    marginTop: 42,
    height: 140,
  },
  createProfileButton: {
    marginTop: theme.spacing.m,
  },
}));

export default useStyles;
