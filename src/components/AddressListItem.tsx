import React, { Key } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { makeStyle } from '../theming';
import { Typography } from './Typography';

export type AddressListProps = {
  /**
   * Number that is displayed on the left of the address.
   */
  number: number;
  /**
   * The bech32 addrres that is displayed to the user.
   */
  address: string;
  /**
   * True if the item should be highlighted to the user.
   */
  highlight?: boolean;
  /**
   * Function called when the user click over the item.
   */
  onPress?: () => void;
  key?: Key | null | undefined;
};

export const AddressListItem: React.FC<AddressListProps> = (props) => {
  const { number, address, highlight, onPress, key, children } = props;
  const styles = useStyles(highlight);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} key={key}>
      <View style={styles.row}>
        <Typography.Body1 style={styles.number}>#{number}</Typography.Body1>

        <Typography.Body1 style={styles.address} ellipsizeMode="middle" numberOfLines={1}>
          {address}
        </Typography.Body1>
      </View>
    </TouchableOpacity>
  );
};

const useStyles = (selected?: boolean) =>
  makeStyle((theme) => ({
    container: {
      display: 'flex',
      backgroundColor: selected ? theme.colors.primary : theme.colors.surface,
      borderRadius: 8,
      paddingTop: 18,
      paddingBottom: 18,
    },
    row: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      flexGrow: 1,
      marginLeft: 16,
      marginRight: 40,
    },
    number: {
      color: selected ? theme.colors.font['5'] : theme.colors.text,
    },
    address: {
      color: selected ? theme.colors.font['5'] : theme.colors.text,
      marginLeft: 24,
    },
  }))();
