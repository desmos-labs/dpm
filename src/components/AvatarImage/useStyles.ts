import { makeStyleWithProps } from 'config/theme';
import AvatarImageProps from './props';

const useStyles = makeStyleWithProps((props: AvatarImageProps, theme) => ({
  container: {
    display: 'flex',
  },
  image: {
    backgroundColor: theme.colors.surface,
    overflow: 'hidden',
    borderRadius: 100,
    height: props.size ?? 24,
    width: props.size ?? 24,
    opacity: props.loading ? 0.5 : 1,
  },
  indicator: {
    position: 'absolute',
    height: props.size ?? 24,
    width: props.size ?? 24,
    borderRadius: 100,
  },
}));

export default useStyles;
