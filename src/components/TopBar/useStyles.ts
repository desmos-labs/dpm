import { makeStyleWithProps } from 'config/theme';
import { TopBarProps } from 'components/TopBar/index';

const useStyles = makeStyleWithProps((props: TopBarProps, theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },

  containerLeft: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    zIndex: 99,
  },
  containerCenter: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textTransform: props.capitalizeTitle === false ? 'none' : 'capitalize',
  },
  containerRight: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    zIndex: 99,
  },
}));

export default useStyles;
