import React, {useCallback, useMemo} from "react";
import {StackScreenProps} from "@react-navigation/stack";
import {ChainLinkScreensStackParams, ImportMode} from "../../types/navigation";
import {StyledSafeAreaView, TopBar, Typography} from "../../components";
import {useTranslation} from "react-i18next";
import {makeStyle} from "../../theming";
import {Image, ImageSourcePropType, StyleProp, StyleSheet, TouchableOpacity, ViewStyle} from "react-native";
import {useTheme} from "react-native-paper";

export type Props = StackScreenProps<ChainLinkScreensStackParams, "ConnectChain">

export const ConnectChain: React.FC<Props> = ({navigation}) => {
    const theme = useTheme();
    const {t} = useTranslation();
    const styles = useStyle();

    const connectMnemonicImage = useMemo(() => {
        return theme.dark ? require("../../assets/connect_mnemonic_dark.png") :
            require("../../assets/connect_mnemonic_light.png");
    }, [theme.dark]);

    // const connectLedgerImage = useMemo(() => {
    //     return theme.dark ? require("../../assets/connect_ledger_dark.png") :
    //         require("../../assets/connect_ledger_light.png");
    // }, [theme.dark]);

    const connectWithMnemonic = useCallback(() => {
        navigation.navigate({
            name: "SelectChain",
            params: {
                importMode: ImportMode.Mnemonic
            }
        })
    }, [navigation]);

    // const connectWithLedger = useCallback(() => {
    //     navigation.navigate({
    //         name: "SelectChain",
    //         params: {
    //             importMode: ImportMode.Ledger
    //         }
    //     })
    // }, [navigation]);

    return <StyledSafeAreaView
        style={styles.background}
        topBar={<TopBar
            style={styles.background}
            stackProps={{navigation}}
            title={t("connect chain")}
        />}
    >
        <Typography.Body>
            {t("select the method you would like to connect your chain account")}
        </Typography.Body>

        <ImageButton
            style={styles.button}
            image={connectMnemonicImage}
            label={t("use secret recovery passphrase")}
            onPress={connectWithMnemonic}
        />

        {/*<ImageButton*/}
        {/*    style={[styles.button, styles.topMargin]}*/}
        {/*    image={connectLedgerImage}*/}
        {/*    label={t("connect with ledger")}*/}
        {/*    onPress={connectWithLedger}*/}
        {/*    disabled*/}
        {/*/>*/}

    </StyledSafeAreaView>
}

const useStyle = makeStyle(theme => ({
    background: {
        backgroundColor: theme.colors.background2
    },
    button: {
        backgroundColor: theme.colors.background,
    },
    topMargin: {
        marginTop: theme.spacing.l
    }
}));

type ImageButtonProps = {
    image: ImageSourcePropType,
    label: string,
    onPress?: () => void,
    disabled?: boolean,
    style?: StyleProp<ViewStyle>
}

const ImageButton: React.FC<ImageButtonProps> = ({image, label, onPress, disabled, style}) => {
    return <TouchableOpacity
        style={[imageButtonStyles.root, style]}
        onPress={onPress}
        disabled={disabled}
    >
        <Image
            source={image}
        />
        <Typography.Body1>
            {label}
        </Typography.Body1>
    </TouchableOpacity>
}

const imageButtonStyles = StyleSheet.create({
    root: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 16,
    }
})
