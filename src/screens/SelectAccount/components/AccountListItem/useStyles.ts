import { makeStyle } from 'config/theme';

const useStyles = (selected?: boolean) =>
  makeStyle((theme) => ({
    container: {
      backgroundColor: selected ? theme.colors.primary : theme.colors.surface,
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 12,
      height: 60,
    },
    row: {
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      alignContent: 'center',
    },
    textContainer: {
      flex: 1,
    },
    address: {
      color: selected ? theme.colors.font['5'] : theme.colors.text,
    },
  }))();

export default useStyles;
