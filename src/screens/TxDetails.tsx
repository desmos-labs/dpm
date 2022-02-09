import React, {useCallback} from "react";
import {StyledSafeAreaView, TopBar, Button} from "../components";
import {StackScreenProps} from "@react-navigation/stack";
import {AccountScreensStackParams} from "../types/navigation";
import {useTranslation} from "react-i18next";
import {TxDetails as TxDetailsComponent} from "../components/tx/TxDetails";
import {Linking} from "react-native";
import {useCurrentChainInfo} from "@desmoslabs/sdk-react";

export type Props = StackScreenProps<AccountScreensStackParams, "TxDetails">

export const TxDetails: React.FC<Props> = (props) => {
    const {messages, memo, fee, dateTime, success, hash} = props.route.params;
    const {t} = useTranslation();
    const chainInfo = useCurrentChainInfo();

    const openExplorer = useCallback(() => {
        let txUrl: string
        if (chainInfo.coinDenom === "udsm") {
            txUrl = `https://explorer.desmos.network/transactions/${hash}`;

        } else {
            txUrl = `https://morpheus.desmos.network/transactions/${hash}`;
        }
        Linking.openURL(txUrl);
    }, [hash, chainInfo])

    return <StyledSafeAreaView
        topBar={<TopBar
            stackProps={props}
            title={t("tx details")}
        />}
    >
        <TxDetailsComponent
            messages={messages}
            memo={memo}
            fee={fee}
            dateTime={dateTime}
            success={success}
        />
        <Button
            mode="text"
            onPress={openExplorer}
        >
            {t("view on explorer")}
        </Button>
    </StyledSafeAreaView>
}
