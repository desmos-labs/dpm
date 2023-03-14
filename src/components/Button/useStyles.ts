import { makeStyleWithProps } from 'config/theme';
import ButtonProps from './props';

const useStyles = makeStyleWithProps((props: ButtonProps, theme) => {
  const accent = props.accent ? theme.colors.accent : theme.colors.primary;
  const color = props.color ? props.color : accent;

  let labelColor = props.mode === 'contained' ? theme.colors.font['5'] : color;
  let borderColor = color;
  if (props.disabled) {
    borderColor = theme.colors.font['3'];
    if (props.mode !== 'contained') {
      labelColor = theme.colors.font['3'];
    }
  }

  return {
    labelStyle: {
      fontFamily: 'Poppins-Medium',
      fontStyle: 'normal',
      fontWeight: '500',
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: 0.0125,
      color: labelColor,
      textTransform: 'capitalize',
    },
    btnStyle: {
      borderColor,
      borderWidth: props.mode === 'outlined' ? 1 : 0,
      elevation: 0,
    },
    contentStyle: {
      height: 42,
    },
  };
});

export default useStyles;
