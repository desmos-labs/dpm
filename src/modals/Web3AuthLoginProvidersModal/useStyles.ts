import { makeStyle } from 'config/theme';
import { Dimensions } from 'react-native';

const useStyles = makeStyle((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: '60%',
    maxWidth: '70%',
    // Use screen dimensions since percentage values don't work for height on modals.
    maxHeight: Math.floor(Dimensions.get('window').height / 2),
  },
  title: {
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  list: {
    flex: 1,
  },
}));

export default useStyles;
