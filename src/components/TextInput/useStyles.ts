import { makeStyleWithProps } from 'config/theme';
import { TextInputProps } from 'components/TextInput/index';
import { TypographyConfigRegular14 } from 'components/Typography/config';

const useStyles = makeStyleWithProps((props: TextInputProps, theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    minHeight: 44,
    alignItems: 'center',
    borderColor: props.error ? theme.colors.error : theme.colors.surface,
    borderWidth: 2,
  },
  left: {
    padding: 0,
    margin: 0,
    paddingLeft: 11,
  },
  input: {
    ...TypographyConfigRegular14,
    paddingHorizontal: 11,
    flexGrow: 1,
    flexShrink: 1,
    textAlignVertical: props.multiline === true ? 'top' : 'center',
    color: theme.colors.font['1'],
    minHeight: props.numberOfLines !== undefined ? 25 * props.numberOfLines : undefined,
  },
  right: {
    padding: 0,
    margin: 0,
    marginRight: 11,
  },
}));

export default useStyles;
