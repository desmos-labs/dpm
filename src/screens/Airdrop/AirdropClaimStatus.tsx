import React, {useCallback, useMemo} from "react";
import {StackScreenProps} from "@react-navigation/stack";
import {AccountScreensStackParams, AirdropScreensStackParams} from "../../types/navigation";
import {Button, Divider, StyledSafeAreaView, TopBar, Typography} from "../../components";
import {useTranslation} from "react-i18next";
import {Image, View} from "react-native";
import {FlexPadding} from "../../components/FlexPadding";
import {makeStyle} from "../../theming";
import useFetchProfile from "../../hooks/useFetchProfile";
import useSelectedAccount from "../../hooks/useSelectedAccount";
import {CompositeScreenProps} from "@react-navigation/native";
import useAirdropFeeGrant from "../../hooks/useAirdropFeeGrant";
import useChainLinks from "../../hooks/useChainLinks";

type Props = CompositeScreenProps<
    StackScreenProps<AirdropScreensStackParams, "AirdropClaimStatus">,
    StackScreenProps<AccountScreensStackParams>>

export const AirdropClaimStatus: React.FC<Props> = ({navigation, route}) => {
    const {params} = route;
    const styles = useStyles();
    const {t} = useTranslation();
    const account = useSelectedAccount();
    const profile = useFetchProfile(account.address);
    const {loading, error, feeGrantStatus, feeGranter} = useAirdropFeeGrant(account.address, params.address);
    const chainLinks = useChainLinks(account.address);

    const profileTaskCompleted = useMemo(() => {
        return profile !== null;
    }, [profile]);

    const accountConnectedTask = useMemo(() => {
        return chainLinks.length > 0;
    }, [chainLinks]);

    const claim = useCallback(() => {
        navigation.navigate({
            name: "AirdropClaimAction",
            params: {
                address: params.address,
                granter: feeGranter,
            }
        })
    }, [navigation, params.address, feeGranter]);

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
                text={t("create Desmos Profile")}
                completed={profileTaskCompleted}
            />
            <Divider/>
            <TaskItem
                text={t("connect Desmos Profile to your wallet accounts")}
                completed={accountConnectedTask}
            />
        </View>
        <Typography.Body1>
            {loading ? t("requesting fee grant") :
                error !== null ? t("an error occurred when requesting the feegrant", {
                    error,
                }) : t("the next transaction fee has bee allocated to you now")
            }
        </Typography.Body1>
        <FlexPadding flex={1} />
        {profileTaskCompleted && accountConnectedTask && (
            <Button
                style={styles.claimRewardsBtn}
                mode="outlined"
                onPress={claimRewards}
            >
                {t("claim pending rewards")}
            </Button>
        )}
        <Button
            mode="contained"
            onPress={claim}
            disabled={loading || error !== null || !feeGrantStatus}
        >
            {t("get started")}
        </Button>
    </StyledSafeAreaView>
}

const useStyles = makeStyle(theme => ({
    tasksContainer: {
        marginTop: theme.spacing.l,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.roundness,
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