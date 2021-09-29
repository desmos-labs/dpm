import React from "react";
import {ImageSourcePropType, Text, TouchableOpacity, View} from "react-native";
import {AvatarImage} from "./AvatarImage";
import {makeStyle} from "../theming";

export type Props = {
    /**
     * The account bech32 address.
     */
    address: string,
    /**
     * The user's profile picture.
     */
    image?: ImageSourcePropType
    /**
     * The user's profile nickname.
     */
    nickname?: string,
    /**
     * The user's profile dtag.
     */
    dtag?: string,
    /**
     * Function called when the user press the item.
     */
    onPress?: () => void
}

export const ProfileListItem: React.FC<Props> = (props) => {
    const styles = useStyles();

    return <TouchableOpacity
        style={styles.root}
        onPress={props.onPress}
    >
        <AvatarImage
            source={props.image ?? require("../assets/desmos-icon-gray.png")}
            size={48}
        />
        <View style={styles.textContainer}>
            <Text
                style={styles.nickname}
            >
                {props.nickname ?? "-"}
            </Text>
            <Text
                style={styles.dtag}
                ellipsizeMode="middle"
                numberOfLines={1}
            >
                {props.dtag ?? props.address}
            </Text>
        </View>
    </TouchableOpacity>
}

const useStyles = makeStyle(theme => ({
    root: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
    },
    textContainer: {
        marginLeft: theme.spacing.s,
    },
    nickname: {
        color: theme.colors.primary,
    },
    dtag: {

    },
}))