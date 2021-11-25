import React, {useCallback, useMemo} from "react";
import {StackScreenProps} from "@react-navigation/stack";
import {AccountScreensStackParams, AirdropScreensStackParams} from "../../types/navigation";
import {Button, StyledSafeAreaView, TopBar, Typography} from "../../components";
import {useTranslation} from "react-i18next";
import {Image} from "react-native";
import {FlexPadding} from "../../components/FlexPadding";
import {makeStyle} from "../../theming";
import useFetchProfile from "../../hooks/useFetchProfile";
import useSelectedAccount from "../../hooks/useSelectedAccount";
import {CommonActions, CompositeScreenProps} from "@react-navigation/native";

type Props = CompositeScreenProps<
    StackScreenProps<AirdropScreensStackParams, "AirdropClaimAction">,
    StackScreenProps<AccountScreensStackParams>>

export const AirdropClaimAction: React.FC<Props> = ({navigation, route}) => {
    const {params} = route;
    const styles = useStyles();
    const {t} = useTranslation();
    const account = useSelectedAccount();
    const profile = useFetchProfile(account.address);

    const profileTaskCompleted = useMemo(() => {
        return profile !== null;
    }, [profile]);

    const startClaim = useCallback(() => {
        if (profileTaskCompleted) {
            navigation.navigate({
                name: "ChainLinkScreens",
                params: {
                    screen: "ConnectChain",
                    params: {
                        backAction: CommonActions.navigate({
                            name: "AirdropClaimRewards",
                            params: {
                                address: params.address,
                            }
                        }),
                        feeGranter: params.granter,
                    }
                }
            })
        } else {
            navigation.navigate({
                name: "EditProfile",
                params: {
                    account: account,
                    goBackTo: "AirdropScreens",
                    feeGranter: params.granter,
                },
            })
        }
    }, [profileTaskCompleted, navigation, account, params.granter, params.address])

    return <StyledSafeAreaView
        topBar={<TopBar
            stackProps={{navigation}}
            title={t("Claim DSM Airdrop")}
            capitalizeTitle={false}
        />}
    >

        <Typography.Body1>
            {!profileTaskCompleted ?
                t("the first thing is that you need to create a Desmos Profile") :
                t("now it's time to connect your Desmos Profile to your first wallet account and claim your airdrop for such account")}
        </Typography.Body1>

        <Image
            style={styles.image}
            resizeMode="contain"
            source={!profileTaskCompleted ?
                require("../../assets/no-profile-light.png") :
                require("../../assets/connect_chain_light.png")
            }
        />

        <FlexPadding flex={1} />

        <Button
            mode="contained"
            onPress={startClaim}
        >
            {!profileTaskCompleted ? t("create profile") : t("connect account")}
        </Button>
    </StyledSafeAreaView>
}

const useStyles = makeStyle(_ => ({
    image: {
        width: 200,
        height: 200,
        alignSelf: "center",
    },
}))
