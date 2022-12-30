import {makeStyle} from 'theming';

const useStyles = (selected?: boolean) => {
  return makeStyle((theme) => ({
    container: {
      display: 'flex',
      backgroundColor: selected ? theme.colors.primary : theme.colors.surface,
      borderRadius: 8,
      paddingTop: 18,
      paddingBottom: 18,
    },
    row: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      flexGrow: 1,
      marginLeft: 16,
      marginRight: 40,
    },
    number: {
      color: selected ? theme.colors.font['5'] : theme.colors.text,
    },
    address: {
      color: selected ? theme.colors.font['5'] : theme.colors.text,
      marginLeft: 24,
    },
  }))();
};

export default useStyles;
