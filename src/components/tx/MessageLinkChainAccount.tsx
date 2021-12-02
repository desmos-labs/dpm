import React, {useMemo} from "react";
import {useTranslation} from "react-i18next";
import {MsgLinkChainAccountEncodeObject} from "@desmoslabs/sdk-core";
import {SimpleMessageComponent} from "./SimpleMessageComponent";
import {MsgLinkChainAccount} from "@desmoslabs/proto/desmos/profiles/v1beta1/msgs_chain_links";
import {Bech32Address} from "@desmoslabs/proto/desmos/profiles/v1beta1/models_chain_links";
import {Image, StyleSheet, View} from "react-native";
import findLinkableChainInfoByName from "../../utilils/find";


export type Props = {
    protobufMessage?: MsgLinkChainAccount
    encodeObject?: MsgLinkChainAccountEncodeObject["value"],
}

export const MessageLinkChainAccount: React.FC<Props> = ({protobufMessage, encodeObject}) => {
    const {t} = useTranslation();

    const from = useMemo(() => {
        return protobufMessage?.signer ?? encodeObject?.signer;
    }, [protobufMessage, encodeObject]);

    const bech32Address = useMemo(() => {
        const chainAddress = protobufMessage?.chainAddress ?? encodeObject?.chainAddress;
        if (chainAddress !== undefined && chainAddress.typeUrl === "/desmos.profiles.v1beta1.Bech32Address") {
            return Bech32Address.decode(chainAddress.value);
        } else {
            return undefined;
        }
    }, [protobufMessage, encodeObject]);

    const chainName = useMemo(() => {
        return protobufMessage?.chainConfig?.name ?? encodeObject?.chainConfig?.name;
    }, [protobufMessage, encodeObject]);


    const chainIcon = useMemo(() => {
        const chain = chainName !== undefined ? findLinkableChainInfoByName(chainName) : undefined;
        if (chain !== undefined) {
            return chain.icon
        } else {
            return require("../../assets/chains/cosmos.png");
        }
    }, [chainName])

    return <SimpleMessageComponent
        customIconView={<View style={styles.customIconView}>
            <Image
                style={styles.chainIcon}
                source={require("../../assets/chains/desmos.png")}
            />
            <Image
                style={styles.disconnectIcon}
                source={require("../../assets/disconnect.png")}
            />
            <Image
                style={styles.chainIcon}
                source={chainIcon}
            />
        </View>}
        fields={[
            {
                label: t("from"),
                value: from
            },
            {
                label: t("connect to"),
                value: bech32Address?.value ?? "",
            },
        ]}
    />
}

const styles = StyleSheet.create({
    customIconView: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
    },
    chainIcon: {
        width: 44,
        height: 44,
    },
    disconnectIcon: {
        width: 24,
        height: 24,
        marginHorizontal: 20,
    }
})