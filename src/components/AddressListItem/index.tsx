import React, { Key } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Typography from 'components/Typography';
import useStyles from './useStyles';

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

const AddressListItem: React.FC<AddressListProps> = (props) => {
  const { number, address, highlight, onPress, key } = props;
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

export default AddressListItem;

