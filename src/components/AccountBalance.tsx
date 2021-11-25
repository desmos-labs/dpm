import React from "react";
import {StyleProp, TouchableOpacity, View, ViewStyle} from "react-native";
import {IconButton} from "./IconButton";
import {useTranslation} from "react-i18next";
import {makeStyle} from "../theming";
import useFetchUserBalance from "../hooks/useFetchUserBalance";
import {Typography} from "./index";


export type Props = {
    /**
     * Address of the account of interest.
     */
    address: string,
    /**
     * The nickname associated to account.
     */
    nickname?: string,
    /**
     * Callback called when the user press the copy button.
     */
    onCopyPress?: () => void,
    /**
     * Callback called when the user click the send button.
     */
    onSendPressed?: () => void,
    style?: StyleProp<ViewStyle>,
}


export const AccountBalance: React.FC<Props> = (props) => {
    const {t} = useTranslation();
    const styles = useStyles();
    const chainBalance = useFetchUserBalance(props.address);

    return <View
        style={[styles.root, props.style]}
    >
        {props?.nickname ? (<Typography.Title
            style={styles.text}
        >
            {props?.nickname}
        </Typography.Title>) : null}
        <View
            style={styles.addressContainer}
        >
            <Typography.Body
                style={[styles.address, styles.text]}
                ellipsizeMode={"middle"}
                numberOfLines={1}
            >
                {props.address}
            </Typography.Body>
            <IconButton
                icon="content-copy"
                size={16}
                onPress={props.onCopyPress}
            />
        </View>
        <View
            style={styles.balanceContainer}
        >
            <View
                style={styles.balanceTextContainer}
            >
                <Typography.Body
                    style={styles.balanceText}
                >
                    {t("available")}
                </Typography.Body>
                <Typography.H4
                    style={styles.balanceText}
                >
                    {chainBalance.amount} {chainBalance.denom.toUpperCase()}
                </Typography.H4>
            </View>
            <TouchableOpacity
                style={styles.sendButton}
                onPress={props.onSendPressed}
            >
                <Typography.Body
                    style={styles.sendButtonText}
                >
                    {t("send")}
                </Typography.Body>
            </TouchableOpacity>
        </View>
    </View>
}

const useStyles = makeStyle(theme => ({
    root: {

    },
    text: {
        color: theme.colors.font["5"],
    },
    addressContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
    },
    address: {
        width: "60%",
        overflow: "hidden",
    },
    balanceContainer: {
        borderRadius: theme.roundness,
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        padding: theme.spacing.m,
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
    },
    balanceTextContainer: {
        display: "flex",
        flexDirection: "column",
        flex: 1,
    },
    balanceText: {
        color: theme.dark ? theme.colors.background : theme.colors.text,
    },
    sendButton: {
        height: 54,
        width: 54,
        borderRadius: 100,
        backgroundColor: theme.colors.primary,
        alignItems: "center",
        justifyContent: "center"
    },
    sendButtonText: {
        color: theme.colors.font["5"],
    }
}))