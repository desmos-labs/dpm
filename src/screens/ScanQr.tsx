import React, {useCallback, useEffect, useState} from "react";
import {BottomTabScreenProps} from "@react-navigation/bottom-tabs";
import {AccountScreensStackParams, AppDrawerParams, HomeScreenBottomTabsParams} from "../types/navigation";
import {StyledSafeAreaView, TextInput} from "../components";
import {CompositeScreenProps} from "@react-navigation/native";
import {DrawerScreenProps} from "@react-navigation/drawer";
import {StackScreenProps} from "@react-navigation/stack";
import QRCodeScanner from "react-native-qrcode-scanner";
import {BarCodeReadEvent} from "react-native-camera";
import {makeStyle} from "../theming";
import {IconButton} from "react-native-paper";
import useWalletConnectPair from "../hooks/useWalletConnectPair";
import useShowModal from "../hooks/useShowModal";
import {SingleButtonModal} from "../modals/SingleButtonModal";
import {useTranslation} from "react-i18next";

export type Props = CompositeScreenProps<
    BottomTabScreenProps<HomeScreenBottomTabsParams, "ScanQr">,
    CompositeScreenProps<
        DrawerScreenProps<AppDrawerParams>, StackScreenProps<AccountScreensStackParams>>
    >;

export const ScanQr: React.FC<Props> = ({navigation}) => {
    const styles = useStyles();
    const {t} = useTranslation();
    const [devUri, setDevUri] = useState("");
    const [pairingStatus, pair] = useWalletConnectPair();
    const openModal = useShowModal();

    const goBack = useCallback(() => {
        navigation.goBack()
    }, [navigation]);

    const onDevUriSubmitted = useCallback(() => {
        pair(devUri).catch(console.error)
    }, [devUri, pair]);

    const openErrorModal = useCallback((message: string) => {
        openModal(SingleButtonModal, {
            title: t("error"),
            message: message,
            actionLabel: t("ok"),
        })
    }, [openModal, t])

    const onQrCoreRead = useCallback(async (event: BarCodeReadEvent) => {
        try {
            await pair(event.data);
        } catch (e) {
            openErrorModal(t("invalid qr code. try a new one or try again"));
        }
    }, [pair, openErrorModal, t]);

    useEffect(() => {
        if (!pairingStatus.pairing) {
            if (pairingStatus.requestDetails) {
                navigation.navigate({
                    name: "AuthorizeSession",
                    params: {
                        sessionRequestDetails: pairingStatus.requestDetails,
                    },
                })
            } else if (pairingStatus.error) {
                openErrorModal(pairingStatus.error)
            }
        }
    }, [navigation, pairingStatus, openErrorModal]);

    return <StyledSafeAreaView
        style={styles.root}
        padding={0}
    >
        <IconButton
            style={styles.backButton}
            icon="close"
            size={18}
            onPress={goBack}
        />
        <QRCodeScanner
            cameraStyle={styles.camera}
            onRead={onQrCoreRead}
            showMarker={true}
            reactivate={true}
            reactivateTimeout={5000}
        />
        {__DEV__ && <TextInput
            style={styles.debugUri}
            onChangeText={setDevUri}
            onSubmitEditing={onDevUriSubmitted}
        />}
    </StyledSafeAreaView>
}

const useStyles = makeStyle(_ => ({
    root: {
        backgroundColor: "rgba(0, 0, 0, 0.7)"
    },
    camera: {
        alignSelf: "center",
        width: "100%"
    },
    backButton: {
        backgroundColor: "#fff",
        position: "absolute",
        top: 16,
        left: 8,
        elevation: 9,
    },
    debugUri: {
        position: "absolute",
        bottom: 0,
        left: 0,
    }
}))