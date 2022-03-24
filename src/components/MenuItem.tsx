import React from 'react';
import { TouchableOpacity } from 'react-native';
import { makeStyle } from '../theming';
import { IconButton } from './IconButton';
import { Typography } from './typography';

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

export const MenuItem: React.FC<MenuItemProps> = (props) => {
  const styles = useStyles();

  return (
    <TouchableOpacity style={styles.root} onPress={props.onPress}>
      <IconButton icon={props.icon} size={props.iconSize ?? 16} color="#c4c4c4" />
      <Typography.Body style={styles.text}>{props.text}</Typography.Body>
    </TouchableOpacity>
  );
};

const useStyles = makeStyle((_) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16,
  },
  text: {
    marginLeft: 8,
  },
}));
