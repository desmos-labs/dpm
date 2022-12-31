import {makeStyle} from 'theming';

const useStyles = makeStyle((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  flexStart: {
    alignSelf: 'flex-start',
  },
  noConnections: {
    alignItems: 'center',
  },
  noConnectionImage: {
    width: 90,
    height: 90,
  },
  connectionItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  chainIcon: {
    width: 32,
    height: 32,
  },
  connectionInfo: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: theme.spacing.s,
  },
  chainName: {
    textTransform: 'capitalize',
  },
  marginTop: {
    marginTop: theme.spacing.m,
  },
  marginBottom: {
    marginBottom: theme.spacing.m,
  },
}));

export default useStyles;
