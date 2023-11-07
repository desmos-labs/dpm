import { makeStyleWithProps } from 'config/theme';
import { StyledSafeAreaViewProps } from 'components/StyledSafeAreaView/index';
import { Dimensions } from 'react-native';

const useStyles = makeStyleWithProps((props: StyledSafeAreaViewProps, theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    paddingHorizontal: props?.paddingHorizontal ?? theme.spacing.m,
    paddingVertical: props?.paddingVertical ?? theme.spacing.m,
    backgroundColor: props.background === undefined ? theme.colors.background : 'transparent',
  },
  background: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    top: 0,
    bottom: 0,
    zIndex: 0,
  },
  scrollViewContainer: {
    flex: 1,
  },
  topBar: { marginHorizontal: -theme.spacing.m, marginTop: -theme.spacing.m, zIndex: 10 },
}));

export default useStyles;
