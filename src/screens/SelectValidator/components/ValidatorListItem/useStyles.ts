import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.s,
  },
  touchableArea: {
    flexDirection: 'row',
  },
  validatorImage: {
    alignSelf: 'center',
    height: 40,
    width: 40,
    borderRadius: 20,
  },
  validatorDetails: {
    display: 'flex',
    flexDirection: 'column',
  },
  validatorActions: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

export default useStyles;
