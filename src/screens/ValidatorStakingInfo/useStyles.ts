import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  dataField: {
    paddingVertical: theme.spacing.m,
  },
  inlineDataField: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.m,
  },
  inlineButtonsContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  inlineButton: {
    flex: 1,
  },
}));

export default useStyles;
