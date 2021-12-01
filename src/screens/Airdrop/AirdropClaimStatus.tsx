import React, {useCallback, useEffect, useMemo} from "react";
import {StackScreenProps} from "@react-navigation/stack";
import {AccountScreensStackParams, AirdropScreensStackParams} from "../../types/navigation";
import {Button, Divider, StyledSafeAreaView, TopBar, Typography} from "../../components";
import {useTranslation} from "react-i18next";
import {Image, View} from "react-native";
import {FlexPadding} from "../../components/FlexPadding";
import {makeStyle} from "../../theming";
import useFetchProfile from "../../hooks/useFetchProfile";
import useSelectedAccount from "../../hooks/useSelectedAccount";
import {CommonActions, CompositeScreenProps} from "@react-navigation/native";
import useChainLinks from "../../hooks/useChainLinks";
import useFeeGrantStatus, {FeeGrantStatus} from "../../hooks/useFeeGrantStatus";
import useCheckPendingRewards from "../../hooks/useCheckPendingRewards";

type Props = CompositeScreenProps<
    StackScreenProps<AirdropScreensStackParams, "AirdropClaimStatus">,
    StackScreenProps<AccountScreensStackParams>>

export const AirdropClaimStatus: React.FC<Props> = ({navigation, route}) => {
    const {params} = route;
    const styles = useStyles();
    const {t} = useTranslation();
    const account = useSelectedAccount();
    const {loading, feeGrantRequestStatus} = useFeeGrantStatus(account.address, params.address);
    const profile = useFetchProfile(account.address);
    const chainLinks = useChainLinks(account.address);
    const pendingRewards = useCheckPendingRewards(account.address);

    useEffect(() => {
        return navigation.addListener("focus", pendingRewards.updatePendingRewards);
    }, [navigation, pendingRewards.updatePendingRewards])

    const profileTaskCompleted = useMemo(() => {
        return profile !== null;
    }, [profile]);

    const accountConnectedTask = useMemo(() => {
        return chainLinks.length > 0;
    }, [chainLinks]);

    const grantTaskCompleted = useMemo(() => {
        return feeGrantRequestStatus?.type === FeeGrantStatus.Claimed;
    }, [feeGrantRequestStatus]);

    const canRequestFeeGrant = useMemo(() => {
        return feeGrantRequestStatus?.type === FeeGrantStatus.Claimable;
    }, [feeGrantRequestStatus])

    const feeGrantUiText = useMemo(() => {
        if (loading) {
            return t("checking fee grant...");
        } else if (feeGrantRequestStatus?.type === FeeGrantStatus.Error) {
            return feeGrantRequestStatus.error;
        } else if (feeGrantRequestStatus?.type === FeeGrantStatus.Claimable) {
            return t("Get a grant to create a Desmos Profile");
        }
    }, [feeGrantRequestStatus, loading, t]);

    const requestFeeGrant = useCallback(() => {
        navigation.navigate({
            name: "AirdropRequestFeeGrant",
            params: {
                externalAddress: params.address,
                desmosAddress: account.address,
            }
        })
    }, [navigation, params.address, account.address]);

    const createProfile = useCallback(() => {
        navigation.navigate({
            name: "EditProfile",
            params: {
                account: account,
                goBackTo: "AirdropScreens",
            },
        })
    }, [navigation, account]);

    const connectAccount = useCallback(() => {
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
                    })
                }
            }
        })
    }, [navigation, params.address])

    const claimRewards = useCallback(() => {
        navigation.navigate({
            name: "AirdropClaimRewards",
            params: {
                address: params.address,
            }
        })
    }, [navigation, params.address]);

    return <StyledSafeAreaView
        topBar={<TopBar
            stackProps={{navigation}}
            title={t("Claim DSM Airdrop")}
            capitalizeTitle={false}
        />}
    >
        <Typography.Body1>
            {t("to claim DSM, you will need to")}
        </Typography.Body1>

        <View style={styles.tasksContainer}>
            <TaskItem
                text={t("Get a grant")}
                completed={grantTaskCompleted}
            />
            <Divider/>
            <TaskItem
                text={t("create Desmos Profile")}
                completed={profileTaskCompleted}
            />
            <Divider/>
            <TaskItem
                text={t("connect Desmos Profile to your wallet accounts")}
                completed={accountConnectedTask}
            />
        </View>
        <Typography.Body1 style={styles.feeGrantStatus}>
            {feeGrantUiText}
        </Typography.Body1>
        <FlexPadding flex={1} />
        {pendingRewards.available && (
            <Button
                style={styles.claimRewardsBtn}
                mode="outlined"
                onPress={claimRewards}
            >
                {t("claim pending rewards")}
            </Button>
        )}
        {loading ? null : (
            <Button
                mode="contained"
                onPress={
                    canRequestFeeGrant ? requestFeeGrant : profileTaskCompleted ?
                        connectAccount: createProfile
                }
                disabled={feeGrantRequestStatus?.type === FeeGrantStatus.Error}
            >
                {
                    canRequestFeeGrant ? t("Get grant") : profileTaskCompleted ?
                        t("connect account") : t("create profile")
                }
            </Button>
        )}
    </StyledSafeAreaView>
}

const useStyles = makeStyle(theme => ({
    tasksContainer: {
        marginTop: theme.spacing.l,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.roundness,
    },
    feeGrantStatus: {
        marginTop: theme.spacing.m,
    },
    claimRewardsBtn: {
        marginBottom: theme.spacing.m,
    }
}))

type TaskItemProps = {
    text: string,
    completed: boolean,
}

const TaskItem: React.FC<TaskItemProps> = ({completed, text}) => {
    const styles = useTaskItemStyle();
    const tickIcon = completed ? require("../../assets/tick_orange.png") : require("../../assets/tick_gray.png");

    return <View style={styles.root}>
        <Image
            style={styles.tick}
            resizeMode="contain"
            source={tickIcon}
        />
        <Typography.Body1 style={styles.text}>
            {text}
        </Typography.Body1>
    </View>
}

const useTaskItemStyle = makeStyle(theme => ({
    root: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        padding: theme.spacing.l,
    },
    tick: {
        width: 16,
        height: 16,
    },
    text: {
        marginStart: theme.spacing.m,
    }
}))