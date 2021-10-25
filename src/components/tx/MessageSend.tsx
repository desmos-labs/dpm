import React, {useMemo} from "react";
import {Image, View} from "react-native";
import {LabeledValue} from "../LabeledValue";
import {useTranslation} from "react-i18next";
import {Divider} from "../Divider";
import {useCurrentChainInfo} from "@desmoslabs/sdk-react";
import {convertCoin, MsgSendEncodeObject} from "@desmoslabs/sdk-core";
import {makeStyle} from "../../theming";
import {Subtitle} from "../index";
import {MsgSend} from "cosmjs-types/cosmos/bank/v1beta1/tx";


export type MessageSendProps = {
    protobufMessage?: MsgSend
    encodeObject?: MsgSendEncodeObject["value"],
}


export const MessageSend: React.FC<MessageSendProps> = ({protobufMessage, encodeObject}) => {
    const {t} = useTranslation();
    const styles = useStyles();
    const chainInfo = useCurrentChainInfo();


    const convertedAmount = useMemo(() => {
        const amount = protobufMessage?.amount ?? encodeObject?.amount

        return amount ? amount.map(amount => {
            const converted = convertCoin(amount, 6, chainInfo.denomUnits);
            if (converted !== null) {
                return `${converted.amount} ${converted.denom.toUpperCase()}`
            } else {
                return `${amount.amount} ${amount.denom}`
            }
        }).join("\n") : "";

    }, [protobufMessage?.amount, encodeObject?.amount, chainInfo.denomUnits])

    return <View>
        <View style={styles.txHeader}>
            <Image
                style={styles.txIcon}
                source={require("../../assets/tx-icons/send.png")}
                resizeMode="contain"
            />
            <Subtitle
                style={styles.headerAmount}
                capitalize={false}>
                {convertedAmount}
            </Subtitle>
        </View>
        <Divider />
        <LabeledValue
            label={t("from")}
            value={protobufMessage?.fromAddress ?? encodeObject?.fromAddress ?? ""}
        />
        <Divider/>

        <LabeledValue
            label={t("to")}
            value={protobufMessage?.toAddress ?? encodeObject?.toAddress ?? ""}
        />
        <Divider/>

        <LabeledValue
            label={t("amount")}
            value={convertedAmount}
        />

    </View>
}

const useStyles = makeStyle(_ => ({
    txHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 24,
    },
    txIcon: {
        width: 34,
        height: 34,
    },
    headerAmount: {
        marginTop: 10,
    }
}))