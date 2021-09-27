import React, {Key} from "react";
import {TouchableOpacity, View} from "react-native";
import {Paragraph} from "./Paragraph";
import {makeStyle} from "../theming";

export type Props = {
    /**
     * Number that is displayed on the left of the address.
     */
    number: number,
    /**
     * The bech32 addrres that is displayed to the user.
     */
    address: string,
    /**
     * True if the item should be highlighted to the user.
     */
    highlight?: boolean,
    /**
     * Function called when the user click over the item.
     */
    onPress?: () => void,
    key?: Key | null | undefined;
}

export const AddressListItem: React.FC<Props> = (props) => {
    const styles = useStyles(props.highlight);

    return <TouchableOpacity style={styles.container} onPress={props.onPress} key={props.key}>
        <View style={styles.row}>
            <Paragraph style={styles.number} fontSize={16}>
                #{props.number}
            </Paragraph>

            <Paragraph style={styles.address} ellipsizeMode={"middle"} numberOfLines={1} >
                {props.address}
            </Paragraph>
        </View>
    </TouchableOpacity>
}

const useStyles = (selected?: boolean) => {
    return makeStyle(theme => ({
        container: {
            display: "flex",
            backgroundColor: selected ? theme.colors.primary : theme.colors.surface,
            borderRadius: 8,
            paddingTop: 18,
            paddingBottom: 18,
        },
        row: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            flexGrow: 1,
            marginLeft: 16,
            marginRight: 40
        },
        number: {
            color: selected ? theme.colors.buttonText : theme.colors.text,
        },
        address: {
            color: selected ? theme.colors.buttonText : theme.colors.text,
            marginLeft: 24,
        }
    }))();
}