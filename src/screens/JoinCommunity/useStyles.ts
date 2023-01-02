import {makeStyle} from 'config/theme';

const useStyles = makeStyle((theme) => ({
  background: {
    backgroundColor: theme.colors.background2,
  },
}));

export default useStyles;
