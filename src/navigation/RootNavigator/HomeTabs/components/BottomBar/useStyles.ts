import { makeStyle } from 'config/theme';
import { Platform } from 'react-native';

const useStyles = makeStyle((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    elevation: 9,
    justifyContent: 'space-around',
    padding: theme.spacing.s,
    paddingBottom: Platform.OS === 'ios' ? theme.spacing.l : theme.spacing.s,
  },
  btn: {
    alignItems: 'center',
    flex: 1,
  },
  btnText: {
    fontSize: 9,
    lineHeight: 11,
    color: theme.colors.font['3'],
    textTransform: 'capitalize',
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
