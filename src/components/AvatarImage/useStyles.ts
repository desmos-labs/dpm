import { makeStyleWithProps } from 'config/theme';
import AvatarImageProps from './props';

const useStyles = makeStyleWithProps((props: AvatarImageProps, theme) => ({
  image: {
    backgroundColor: theme.colors.surface,
    overflow: 'hidden',
    borderRadius: 100,
    height: props.size ?? 24,
    width: props.size ?? 24,
  },
}));

export default useStyles;
