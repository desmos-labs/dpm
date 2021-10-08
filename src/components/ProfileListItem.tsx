import React, {useMemo, useState} from "react";
import {ImageSourcePropType, Text, TouchableOpacity, View} from "react-native";
import {AvatarImage} from "./AvatarImage";
import {makeStyle} from "../theming";
import {Menu, IconButton, useTheme} from "react-native-paper";
import {useTranslation} from "react-i18next";
import {MenuItem} from "./MenuItem";
import {Divider} from "./Divider";

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
    /**
     * Callback called if the user want to edit the profile.
     */
    onEdit?: () => void,
    /**
     * Callback called if the user want to delete the account.
     */
    onDelete?: () => void,
}

export const ProfileListItem: React.FC<Props> = (props) => {
    const theme = useTheme();
    const {t} = useTranslation();
    const styles = useStyles();
    const [menuVisible, setMenuVisible] = useState(false);

    const showMenu = useMemo(() => {
        return props.onEdit !== undefined || props.onDelete !== undefined;
    }, [props.onEdit, props.onDelete])

    const onMenuOpen = () => {
        setMenuVisible(true);
    }

    const onMenuDismiss = () => {
        setMenuVisible(false);
    }

    return <TouchableOpacity
        style={styles.root}
        onPress={props.onPress}
    >
        <AvatarImage
            source={props.image ?? require("../assets/default-profile-picture.png")}
            size={48}
        />
        <View style={styles.textContainer}>
            <Text
                style={styles.nickname}
                numberOfLines={1}
                ellipsizeMode="tail"
            >
                {props.nickname ?? "-"}
            </Text>
            <Text
                style={styles.dtag}
                ellipsizeMode="middle"
                numberOfLines={1}
            >
                {props.dtag !== undefined ? `@${props.dtag}` : props.address}
            </Text>
        </View>
        {showMenu && <Menu
            visible={menuVisible}
            onDismiss={onMenuDismiss}
            anchor={<IconButton
                icon="dots-vertical"
                onPress={onMenuOpen}
                size={18}
                color={theme.colors.icon}
            />}
        >
            {props.onEdit && <MenuItem
                icon="pencil"
                text={t("edit profile")}
                onPress={() => {
                    setMenuVisible(false);
                    props.onEdit!();
                }}
            />}
            {props.onEdit && props.onDelete && <Divider style={styles.menuDivider}/>}
            {props.onDelete && <MenuItem
                icon="delete-outline"
                text={t("delete account")}
                onPress={() => {
                    setMenuVisible(false);
                    props.onDelete!();
                }}
            />}
        </Menu>}
    </TouchableOpacity>
}

const useStyles = makeStyle(theme => ({
    root: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    textContainer: {
        marginLeft: theme.spacing.s,
        flexGrow: 1,
        flexShrink: 1,
    },
    nickname: {
        color: theme.colors.primary,
    },
    dtag: {
    },
    menuDivider: {
        marginHorizontal: 16,
    }
}))