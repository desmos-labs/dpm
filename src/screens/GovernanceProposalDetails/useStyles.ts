import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  topBar: {
    zIndex: 5,
  },
  proposalIdContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  headerContainer: {
    backgroundColor: theme.colors.background,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    zIndex: 4,
  },
}));

export default useStyles;
