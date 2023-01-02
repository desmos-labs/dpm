import {makeStyle} from 'config/theme';

const useStyles = (disable: boolean, active: boolean, translation: any) => {
  return makeStyle((theme) => ({
    opacity: {
      padding: 8,
      marginLeft: 6,
      opacity: disable ?  0.3 : 1.0,
    },
    button: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    square: {
      width: 28,
      height: 4,
      borderRadius: 1,
      backgroundColor: active ? theme.colors.toggle.active : theme.colors.toggle.inactive,
    },
    line: {
      width: 14,
      position: 'absolute',
      height: 14,
      borderRadius: 2,
      backgroundColor: active ? theme.colors.toggle.active : theme.colors.toggle.inactive,
      transform: [{ translateX: translation }],
    },
  }))();
};

export default useStyles;
