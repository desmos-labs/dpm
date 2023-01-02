import {makeStyle} from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    backgroundColor: theme.colors.background2,
  },
  topBar: {
    backgroundColor: theme.colors.background2,
  },
  dappDetails: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flexGrow: 10,
    flexBasis: 0,
  },
  dappIcon: {
    width: 60,
    height: 60,
  },
  permissionMessage: {
    marginTop: theme.spacing.m,
    textAlign: 'center',
  },
  permissionList: {
    marginTop: theme.spacing.m,
    alignSelf: 'flex-start',
    width: '100%',
  },
  borderTop: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  borderBot: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  permissionItem: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.s,
  },
  bottomMessage: {
    textAlign: 'center',
    marginTop: theme.spacing.m,
    flexGrow: 1,
  },
  denyButton: {
    marginTop: theme.spacing.s,
  },
}));

export default useStyles;
