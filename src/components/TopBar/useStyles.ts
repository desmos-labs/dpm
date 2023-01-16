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
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  containerLeft: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    zIndex: 1,
    minHeight: 60,
  },
  containerCenter: {
    flex: 2,
  },
  title: {
    textTransform: props.capitalizeTitle === false ? 'none' : 'capitalize',
    textAlign: 'center',
  },
  containerRight: {
    alignItems: 'flex-end',
    zIndex: 1,
  },
}));

export default useStyles;
