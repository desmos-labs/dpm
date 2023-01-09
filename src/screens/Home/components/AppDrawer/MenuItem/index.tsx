import React from 'react';
import { TouchableOpacity } from 'react-native';
import IconButton from 'components/IconButton';
import Typography from 'components/Typography';
import useStyles from './useStyles';

export type MenuItemProps = {
  /**
   * The menu item text.
   */
  text: string;
  /**
   * The icon to show before the text.
   */
  icon: string;
  /**
   * Size of the icon. if not provided the default size is 16.
   */
  iconSize?: number;
  /**
   * Callback called when the user press the item.
   */
  onPress?: () => void;
};

const MenuItem: React.FC<MenuItemProps> = (props) => {
  const { text, icon, iconSize, onPress } = props;
  const styles = useStyles();

  return (
    <TouchableOpacity style={styles.root} onPress={onPress}>
      <IconButton icon={icon} size={iconSize ?? 16} color="#c4c4c4" />
      <Typography.Body style={styles.text}>{text}</Typography.Body>
    </TouchableOpacity>
  );
};

export default MenuItem;
