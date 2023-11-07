import { makeStyleWithProps } from 'config/theme';
import { Platform } from 'react-native';
import { StyledSafeAreaViewProps } from 'components/StyledSafeAreaView/index';

const useStyles = makeStyleWithProps((props: StyledSafeAreaViewProps, theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: Platform.OS === 'android' || props.noIosPadding === true ? 0 : 24,
    backgroundColor: theme.colors.background,
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: undefined,
    top: 0,
    bottom: 0,
    zIndex: 0,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    padding: props?.padding ?? theme.spacing.m,
    backgroundColor: props.background === undefined ? theme.colors.background : 'transparent',
  },
  scrollViewContainer: {
    flex: 1,
  },
}));

export default useStyles;
