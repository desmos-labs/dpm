import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  touchableArea: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  validatorImage: {
    backgroundColor: 'blu',
  },
  validatorDetails: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

export default useStyles;
