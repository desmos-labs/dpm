import {makeStyle} from 'theming';

const useStyles = makeStyle((theme) => ({
  root: {
    flex: 1,
  },
  hpPathLabel: {
    marginTop: theme.spacing.l,
  },
  hdPathPicker: {
    marginTop: theme.spacing.s,
  },
  addressText: {
    marginTop: theme.spacing.m,
  },
  dividerContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.s,
  },
  dividerLine: {
    flex: 4,
  },
  dividerText: {
    flex: 2,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  toggleSelectAccount: {
    marginTop: theme.spacing.l,
  },
  toggleSelectAccountEnabled: {
    color: theme.colors.primary,
  },
  addressesList: {
    flex: 1,
    marginTop: theme.spacing.s,
  },
  disabledText: {
    color: theme.colors.disabled,
  },
}));

export default useStyles;
