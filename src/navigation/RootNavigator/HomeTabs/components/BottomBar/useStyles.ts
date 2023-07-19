import { makeStyle } from 'config/theme';
import { Platform } from 'react-native';

const useStyles = makeStyle((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.s,
    paddingBottom: Platform.select({
      ios: theme.spacing.xl,
      android: theme.spacing.s,
    }),

    // Shadows
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: -1,
    },
    shadowRadius: 2,
    elevation: 9,
    shadowOpacity: 1,
  },
  btn: {
    alignItems: 'center',
    flex: 1,
  },
  btnText: {
    color: theme.colors.font['3'],
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  btnTextSelected: {
    color: theme.colors.primary,
  },
  tabBarBadge: {
    backgroundColor: theme.colors.primary,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: theme.colors.font['5'],
    width: 20,
    height: 20,
    borderRadius: 12,
    position: 'absolute',
    right: '28%',
    bottom: '65%',
  },
}));

export default useStyles;
