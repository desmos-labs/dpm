import { makeStyle } from 'config/theme';

const useStyles = makeStyle(() => ({
  proposalIdContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'baseline',
  },
}));

export default useStyles;
