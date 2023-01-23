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
  },
  indicator: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 100,
  },
}));

export default useStyles;
