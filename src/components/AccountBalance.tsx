import React from "react";
import {Title} from "./Title";
import {StyleProp, TouchableOpacity, View, ViewStyle, Text} from "react-native";
import {Paragraph} from "./Paragraph";
import {IconButton} from "./IconButton";
import {useTranslation} from "react-i18next";
import {makeStyle} from "../theming";
import useFetchUserBalance from "../hooks/useFetchUserBalance";


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
        {props?.nickname ? (<Title
            style={styles.text}
        >
            {props?.nickname}
        </Title>) : null}
        <View
            style={styles.addressContainer}
        >
            <Paragraph
                style={[styles.address, styles.text]}
                ellipsizeMode={"middle"}
                numberOfLines={1}
            >
                {props.address}
            </Paragraph>
            <IconButton
                icon="content-copy"
                size={16}
                onPress={props.onCopyPress}
                color="#c4c4c4"
            />
        </View>
        <View
            style={styles.balanceContainer}
        >
            <View
                style={styles.balanceTextContainer}
            >
                <Paragraph>
                    {t("available")}:
                </Paragraph>
                <Title capitalize={false}>
                    {chainBalance.amount} {chainBalance.denom.toUpperCase()}
                </Title>
            </View>
            <TouchableOpacity
                style={styles.sendButton}
                onPress={props.onSendPressed}
            >
                <Text
                    style={styles.sendButtonText}
                >
                    {t("send")}
                </Text>
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
        fontSize: 14,
        lineHeight: 21,
        padding: 0,
        margin: 0,
    }
}))