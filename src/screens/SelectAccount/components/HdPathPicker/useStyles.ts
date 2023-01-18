import { makeStyleWithProps } from 'config/theme';
import { HdPathPickerProps } from 'screens/SelectAccount/components/HdPathPicker/index';

const useStyle = makeStyleWithProps((props: HdPathPickerProps, theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  elements: {
    maxWidth: 70,
    flexGrow: 1,
  },
  input: {
    textAlignVertical: 'center',
    color: props.disabled ? theme.colors.disabled : theme.colors.text,
  },
  hdPathText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: 0.005,
    textAlign: 'left',
    color: props.disabled ? theme.colors.disabled : theme.colors.text,
  },
}));

export default useStyle;
