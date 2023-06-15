import { makeStyleWithProps } from 'config/theme';
import BadgeProps from './props';

const useStyles = makeStyleWithProps((props: BadgeProps, theme) => ({
  root: {
    backgroundColor: `${theme.colors.primary}10`,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: theme.roundness,
  },
  text: {
    color: theme.colors.primary,
    textTransform: props.capitalize ? 'capitalize' : undefined,
  },
}));

export default useStyles;
