import { makeStyle } from 'config/theme';

const useStyles = (isBegin: boolean, isEnd: boolean) =>
  makeStyle((theme) => ({
    root: {
      backgroundColor: theme.colors.surface2,
      borderTopLeftRadius: isBegin ? 8 : 0,
      borderTopRightRadius: isBegin ? 8 : 0,
      borderBottomLeftRadius: isEnd ? 8 : 0,
      borderBottomRightRadius: isEnd ? 8 : 0,
    },
  }))();

export default useStyles;
