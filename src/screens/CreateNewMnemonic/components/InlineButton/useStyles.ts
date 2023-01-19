import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    backgroundColor: 'rgba(237, 108, 83, 0.1)',
  },
  label: {
    fontSize: 14,
  },
  contentStyle: {
    height: 38,
  },
  selected: {
    backgroundColor: theme.colors.primary,
  },
  selectedLabel: {
    color: theme.colors.font['3'],
  },
}));

export default useStyles;
