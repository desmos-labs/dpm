import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  qrCodeView: {
    padding: 12,
    backgroundColor: theme.colors.background,
    borderRadius: theme.roundness,
    justifyContent: 'center',
    alignItems: 'center',

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
