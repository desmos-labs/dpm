import {makeStyle} from 'config/theme';

const useStyles = makeStyle((theme) => ({
  input: {
    flexGrow: 1,
    textAlignVertical: 'top',
    color: theme.colors.font['1'],
    maxHeight: '85%',
  },
  charCount: {
    alignSelf: 'flex-end',
    right: 0,
    color: theme.colors.font['3'],
  },
  charCountWarning: {
    color: theme.colors.primary,
  },
}));

export default useStyles;
