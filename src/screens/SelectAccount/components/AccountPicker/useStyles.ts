import { makeStyle } from 'config/theme';

const useStyles = makeStyle((theme) => ({
  root: {
    flex: 1,
  },
  hdPathPickerView: {
    flex: 1,
  },
  hdPathPicker: {
    marginTop: theme.spacing.s,
  },
  pickerOptionButtonLabel: {
    fontSize: 12,
    lineHeight: 18,
  },
}));

export default useStyles;
