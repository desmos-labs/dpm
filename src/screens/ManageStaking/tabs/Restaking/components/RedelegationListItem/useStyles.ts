import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
    borderRadius: theme.roundness,
  },
  dataField: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dataFieldMultipleValue: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  daysToComplete: {
    color: theme.colors.primary,
  },
}));

export default useStyles;
