import {Title} from "./Title";
import {StyleProp, View, ViewStyle} from "react-native";
import {Paragraph} from "./Paragraph";
import {IconButton} from "react-native-paper";
import {Button} from "./Button";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {makeStyle} from "../theming";
import {useCurrentChainInfo, useDesmosClient} from "@desmoslabs/sdk-react";
import {Coin} from "cosmjs-types/cosmos/base/v1beta1/coin";

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
    const client = useDesmosClient();
    const chainInfo = useCurrentChainInfo();
    const [userBalance, setUserBalance] = useState<Coin>({
        amount: "0",
        denom: chainInfo.coinDenom,
    });

    useEffect(() => {
        (async () => {
            setUserBalance({
                amount: "0",
                denom: chainInfo.coinDenom,
            });
            try {
                await client.connect();
                const balance = await client.getBalance(props.address, chainInfo.coinDenom);
                setUserBalance(balance);
            } catch (e) {
                // Ignore network error and account not present
                // on the chain
            }
        })()
    }, [props.address, client, chainInfo])

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
                color="#ffffff"
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
                <Title>
                    {userBalance.amount} {userBalance.denom}
                </Title>
            </View>
            <Button
                mode="contained"
                onPress={props.onSendPressed}
            >
                {t("send")}
            </Button>
        </View>
    </View>
}

const useStyles = makeStyle(theme => ({
    root: {

    },
    text: {
        color: "#ffffff",
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
    }
}))