import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  qrCodeContainer: {
    marginTop: theme.spacing.m,
    // Shadows
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 20,
    elevation: 8,
    shadowOpacity: 1,
  },
  qrCodeView: {
    padding: 8,
    backgroundColor: theme.colors.background,
    borderRadius: theme.roundness,
  },
  addressContainer: {
    marginTop: theme.spacing.xl,
    marginHorizontal: 42,
    padding: theme.spacing.s,
    borderRadius: theme.roundness,
    backgroundColor: theme.colors.surface,
  },
  copyButton: {
    marginVertical: theme.spacing.xl,
  },
}));

export default useStyles;
