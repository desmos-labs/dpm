import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
  },
  addressesList: {
    flex: 1,
    width: '100%',
    marginTop: theme.spacing.s,
  },
  pickerOptionButtonLabel: {
    fontSize: 12,
    lineHeight: 18,
  },

  hpPathLabel: {
    marginTop: theme.spacing.l,
  },
  hdPathPicker: {
    marginTop: theme.spacing.s,
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

  disabledText: {
    color: theme.colors.disabled,
  },
}));

export default useStyles;
