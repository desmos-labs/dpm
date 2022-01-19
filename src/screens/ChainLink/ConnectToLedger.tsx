import React, {useCallback} from "react";
import {CompositeScreenProps} from "@react-navigation/native";
import {StackScreenProps} from "@react-navigation/stack";
import {ChainLinkScreensStackParams, ImportMode, RootStackParams} from "../../types/navigation";
import {Button, DpmImage, StyledSafeAreaView, ThemedLottieView, TopBar, Typography} from "../../components";
import {useTranslation} from "react-i18next";
import useConnectToLedger from "../../hooks/ledger/useConnectToLedger";
import {makeStyle} from "../../theming";
import {FlexPadding} from "../../components/FlexPadding";


export type Props = CompositeScreenProps<
    StackScreenProps<ChainLinkScreensStackParams, "ConnectToLedger">,
    StackScreenProps<RootStackParams>>;

export const ConnectToLeger: React.FC<Props> = ({navigation, route}) => {
    const {bleLedger, chain, backAction, ledgerApp} = route.params
    const {t} = useTranslation();
    const styles = useStyles();
    const {connecting, connected, connectionError, transport, retry} = useConnectToLedger(bleLedger, ledgerApp);


    const onButtonPressed = useCallback(() => {
        if (connected) {
            navigation.pop(1);
            navigation.navigate({
                name: "PickAddress",
                params: {
                    importMode: ImportMode.Ledger,
                    chain,
                    backAction,
                    ledgerTransport: transport,
                    ledgerApp,
                }
            });
        } else {
            retry();
        }
    }, [backAction, chain, connected, ledgerApp, navigation, retry, transport])

    return <StyledSafeAreaView
        topBar={<TopBar
            stackProps={{navigation}}
        />}
    >

        {connecting ? (
            <ThemedLottieView
                style={styles.animation}
                source={"connect-to-ledger"}
                autoPlay={true}
                loop={true}
                autoSize={true}
            />) : connected ? (
            <DpmImage
                style={styles.image}
                source={"success"}
            />
        ) : (
            <DpmImage
                style={styles.image}
                source={"fail"}
            />)
        }

        <Typography.Subtitle
            style={styles.status}
        >
            {connecting ? t("Connecting") :
                connected ? t("Connected") : t("Error")}
        </Typography.Subtitle>

        <Typography.Body
            style={styles.errorMessage}
        >
            {connectionError}
        </Typography.Body>

        <FlexPadding flex={1} />
        <Button
            mode="contained"
            onPress={onButtonPressed}
            disabled={connecting}
            loading={connecting}
        >
            {connecting ? t("Connecting") :
                connected ? t("next") : t("retry")
            }
        </Button>
    </StyledSafeAreaView>
}


const useStyles = makeStyle(theme => ({
    image: {
        width: "60%",
        height: "30%",
        alignSelf: "center",
    },
    animation: {
        alignSelf: "center",
    },
    status: {
        marginTop: theme.spacing.m,
        textAlign: "center",
        alignSelf: "center",
    },
    errorMessage: {
        marginTop: theme.spacing.m,
        color: theme.colors.error,
        textAlign: "center",
        alignSelf: "center",
    }
}))