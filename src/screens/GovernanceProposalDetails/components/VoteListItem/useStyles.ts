import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileInfo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  name: {
    maxWidth: '80%',
  },
  colorPositive: {
    color: theme.colors.feedbackSuccess,
  },
  colorNegative: {
    color: theme.colors.feedbackError,
  },
  colorNeutral: {
    color: theme.colors.feedbackWarning,
  },
}));

export default useStyles;
