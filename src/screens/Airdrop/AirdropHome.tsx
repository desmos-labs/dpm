import {StackScreenProps} from "@react-navigation/stack";
import {AirdropScreensStackParams} from "../../types/navigation";
import React, {useCallback, useState} from "react";
import {Button, StyledSafeAreaView, TextInput, TopBar, Typography} from "../../components";
import {makeStyle} from "../../theming";
import {useTranslation} from "react-i18next";
import {Image, KeyboardAvoidingView, Platform} from "react-native";
import {Bech32} from "@cosmjs/encoding";
import useShowModal from "../../hooks/useShowModal";
import {SingleButtonModal} from "../../modals/SingleButtonModal";


export type Props = StackScreenProps<AirdropScreensStackParams, "AirdropHome">;

export const AirdropHome: React.FC<Props> = ({navigation}) => {
    const styles = useStyles();
    const {t} = useTranslation();
    const showModal = useShowModal()
    const [address, setAddress] = useState("");

    const calculate = useCallback(() => {
        try {
            Bech32.decode(address);
            navigation.navigate({
                name: "AirdropAllocation",
                params: {
                    address
                }
            })
        } catch (e) {
            showModal(SingleButtonModal, {
                title: t("invalid address"),
                message: t("invalid address"),
                image: "fail",
                actionLabel: t("ok"),
            })
        }
    }, [showModal, address, t, navigation]);

    return <StyledSafeAreaView
        topBar={<TopBar
            stackProps={{navigation}}
        />}
    >
        <KeyboardAvoidingView
            behavior="padding"
            style={styles.container}
            keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        >
            <Image
                style={styles.airdropText}
                source={require("../../assets/dsm_airdrop_text.png")}
                resizeMode="contain"
            />
            <Typography.Body1 style={styles.eligibilityText}>
                {t("check your eligibility now!")}
            </Typography.Body1>
            <Image
                source={require("../../assets/airdrop_logo.png")}
                style={styles.airdropLogo}
                resizeMode="contain"
            />
            <Typography.Body1
                style={styles.addressInputLabel}
            >
                {t("please insert your address")}
            </Typography.Body1>
            <TextInput
                style={styles.addressInput}
                numberOfLines={1}
                placeholder={"cosmos / kava / regen / ... address"}
                onChangeText={setAddress}
                onSubmitEditing={calculate}
            />
            <Button
                mode="contained"
                style={styles.calculateBtn}
                onPress={calculate}
            >
                {t("calculate")}
            </Button>
        </KeyboardAvoidingView>
    </StyledSafeAreaView>
}

const useStyles = makeStyle(theme => ({
    container: {
        flex: 1,
    },
    airdropText: {
        width: "100%",
    },
    airdropLogo: {
        width: "100%",
        height: "40%",
        marginTop: theme.spacing.m,
    },
    eligibilityText: {
        alignSelf: "center",
    },
    addressInputLabel: {
        marginTop: theme.spacing.m,
    },
    addressInput: {
        marginTop: theme.spacing.s,
    },
    calculateBtn: {
        marginTop: theme.spacing.m,
    }
}))