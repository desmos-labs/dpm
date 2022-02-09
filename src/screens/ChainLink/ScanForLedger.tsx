import React, {useCallback, useEffect} from "react";
import {StackScreenProps} from "@react-navigation/stack";
import {ChainLinkScreensStackParams} from "../../types/navigation";
import {
    Button,
    DpmImage,
    ListItemSeparator,
    StyledSafeAreaView,
    ThemedLottieView,
    TopBar,
    Typography
} from "../../components";
import {makeStyle} from "../../theming";
import {useTranslation} from "react-i18next";
import useStartBleScan from "../../hooks/ledger/useStartBleScan";
import {FlatList, ListRenderItemInfo, TouchableOpacity} from "react-native";
import {BleLedger} from "../../types/ledger";


export type Props = StackScreenProps<ChainLinkScreensStackParams, "ScanForLedger">

export const ScanForLedger: React.FC<Props> = ({navigation, route}) => {
    const {chain, ledgerApp, backAction} = route.params;
    const styles = useStyles();
    const {t} = useTranslation();
    const {scanning, scan, devices, scanError} = useStartBleScan();

    useEffect(() => {
        scan();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const selectDevice = useCallback(async (ledger: BleLedger) => {
        navigation.navigate({
            name: "ConnectToLedger",
            params: {
                chain,
                ledgerApp,
                bleLedger: ledger,
                backAction,
            }
        })
    }, [navigation, backAction, chain, ledgerApp]);

    const renderLedgerDevice = useCallback((info: ListRenderItemInfo<BleLedger>) => {
        return <TouchableOpacity
            style={styles.ledgerListItem}
            onPress={() => selectDevice(info.item)}
        >
            <DpmImage source="ledger" />
            <Typography.Subtitle
                style={styles.ledgerName}
            >
                {info.item.name}
            </Typography.Subtitle>
        </TouchableOpacity>
    }, [selectDevice, styles.ledgerListItem, styles.ledgerName]);

    const onRetryPressed = useCallback(() => {
        scan();
    }, [scan]);

    return <StyledSafeAreaView
        topBar={<TopBar stackProps={{navigation}} />}
        style={styles.root}
    >
        <ThemedLottieView
            style={styles.lookingForDevices}
            source={"looking-for-devices"}
            loop={true}
            autoSize={true}
            autoPlay={true}
            speed={scanning ? 1 : 0}
            progress={scanning ? undefined : 0}
        />
        <Typography.Subtitle
            style={styles.title}
        >
            {t("looking for devices")}
        </Typography.Subtitle>

        <Typography.Body
            style={styles.advice}
        >
            {t("nano x unlock bluetooth check")}
        </Typography.Body>

        {scanning || devices.length > 0 ? (
            <FlatList
                style={styles.deviceList}
                data={devices}
                renderItem={renderLedgerDevice}
                keyExtractor={item => item.id}
                ItemSeparatorComponent={ListItemSeparator}
            />) : (
            <Typography.Subtitle
                style={styles.noDeviceError}
            >
                {scanError?.message ?? t("no device found")}
            </Typography.Subtitle>)
        }

        {!scanning && devices.length === 0 && (
            <Button
                style={styles.retryScan}
                mode="contained"
                onPress={onRetryPressed}
            >
                {t("retry")}
            </Button>
        )}
    </StyledSafeAreaView>
}

const useStyles = makeStyle(theme => ({
    root: {
        display: "flex",
        flexDirection: "column",
    },
    lookingForDevices: {
        alignSelf: "center",
    },
    title: {
        marginTop: theme.spacing.xl,
        alignSelf: "center",
    },
    advice: {
        textAlign: "center",
        marginTop: theme.spacing.l,
        paddingHorizontal: theme.spacing.m,
    },
    deviceList: {
        marginTop: theme.spacing.xl,
    },
    noDeviceError: {
        alignSelf: "center",
        color: theme.colors.primary,
        marginTop: theme.spacing.l,
    },
    ledgerListItem: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.m,
    },
    ledgerName: {
        marginStart: theme.spacing.m,
    },
    retryScan: {
        marginTop: theme.spacing.m,
    }
}));