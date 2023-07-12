import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  title: {
    alignSelf: 'center',
  },
  voteOption: {
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: theme.colors.background2,
    borderRadius: theme.roundness,
  },
  voteOptionIcon: {
    width: 24,
    height: 24,
    marginEnd: 8,
  },
}));

export default useStyles;
