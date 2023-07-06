import { makeStyle } from 'config/theme';

const useStyles = (selected?: boolean) =>
  makeStyle((theme) => ({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 12,
      height: 70,
      borderColor: selected ? theme.colors.primary : theme.colors.surface,
      borderStyle: 'solid',
      borderWidth: 1,
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
      color: theme.colors.text,
    },
  }))();

export default useStyles;
