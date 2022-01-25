import React, {useCallback, useEffect} from "react";
import {StackScreenProps} from "@react-navigation/stack";
import {AirdropScreensStackParams} from "../../types/navigation";
import {Button, DpmImage, StyledSafeAreaView, ThemedLottieView, Typography} from "../../components";
import useReuestFeeGrant from "../../hooks/useRequestFeeGrant";
import {useTranslation} from "react-i18next";
import {makeStyle} from "../../theming";
import {Dimensions, Platform} from "react-native";
import {FlexPadding} from "../../components/FlexPadding";


export type Props = StackScreenProps<AirdropScreensStackParams, "AirdropRequestFeeGrant">;

export const AirdropRequestFeeGrant: React.FC<Props> = ({navigation, route}) => {
    const {desmosAddress, externalAddress} = route.params;
    const {t} = useTranslation();
    const styles = useStyles();
    const {error, issued} = useReuestFeeGrant(desmosAddress, externalAddress);

    useEffect(() => {
        if (issued) {
            navigation.goBack();
        }
    }, [issued, navigation]);

    const goBack = useCallback(() => {
        navigation.goBack();
    }, [navigation])

    return <StyledSafeAreaView
        style={styles.root}
    >
        {error === undefined ? (
            <ThemedLottieView
                style={styles.loadingAnimation}
                source={"broadcast-tx"}
                autoPlay
                loop
                autoSize
                resizeMode="cover"
            />
        ) : (
            <DpmImage
                style={styles.loadingAnimation}
                source={"fail"}
            />
        )}

        <Typography.H4
            style={styles.title}
        >
            {t("getting grant")}
        </Typography.H4>
        <Typography.Body
            style={styles.message}
        >
            {error ?? t("wait for grant")}
        </Typography.Body>

        <FlexPadding flex={1} />
        {error !== undefined && (
            <Button
                mode="outlined"
                onPress={goBack}
            >
                {t("go back")}
            </Button>
        )}
    </StyledSafeAreaView>
}

const useStyles = makeStyle(theme => ({
    root: {
        display: "flex",
        flexDirection: "column",
    },
    loadingAnimation: {
        marginTop: "26%",
        height: Dimensions.get('window').height * 0.30 ?? 240,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
    },
    title: {
        marginTop: Platform.OS === "ios" ? 62 : theme.spacing.l,
        textTransform: "capitalize",
        alignSelf: "center",
    },
    message: {
        textAlign: "center",
        alignSelf: "center",
    }
}))