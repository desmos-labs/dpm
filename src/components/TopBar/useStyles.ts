import { makeStyleWithProps } from 'config/theme';
import { Platform, StatusBar } from 'react-native';
import { TopBarProps } from 'components/TopBar/index';

const useStyles = makeStyleWithProps((props: TopBarProps, theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 42,
    maxHeight: 80,
  },
  containerLeft: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    zIndex: 99,
  },
  containerCenter: {
    flex: 3,
    height: '100%',
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
