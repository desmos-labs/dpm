import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  details: {
    marginLeft: theme.spacing.m,
  },
  statusRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusDotActive: {
    backgroundColor: '#1EC490',
  },
  statusDotInactive: {
    backgroundColor: theme.colors.font.red,
  },
  statusText: {
    marginLeft: theme.spacing.xs,
  },
  statusTextActive: {
    color: '#1EC490',
  },
  statusTextInactive: {
    color: theme.colors.font.red,
  },
}));

export default useStyles;
