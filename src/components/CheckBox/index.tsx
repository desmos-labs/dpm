import React from 'react';
import { IconButton } from 'react-native-paper';

export interface DpmCheckBoxProps {
  /**
   * Checkbox status, true means checked, false unchecked.
   */
  readonly status: boolean;
  /**
   * Custom checkbox color.
   */
  readonly color?: string;
  /**
   * Callback called when the user press on the checkbox.
   */
  readonly onPress?: () => any;
  /**
   * testID to be used on tests.
   */
  readonly testID?: string;
}

/**
 * Simple checkbox implementation with the application style.
 */
const DpmCheckBox: React.FC<DpmCheckBoxProps> = ({ status, color, onPress, testID }) => {
  const checkBoxIcon = React.useMemo(
    () => (status ? 'check-circle-outline' : 'checkbox-blank-circle-outline'),
    [status],
  );

  return (
    <IconButton icon={checkBoxIcon} onPress={onPress} testID={testID} color={color ?? '#ffffff'} />
  );
};

export default DpmCheckBox;
