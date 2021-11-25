import React, {useCallback, useState} from "react";
import {StackScreenProps} from "@react-navigation/stack";
import {AirdropScreensStackParams} from "../../types/navigation";
import {Button, StyledSafeAreaView, TopBar, Typography} from "../../components";
import {useTranslation} from "react-i18next";
import {FlexPadding} from "../../components/FlexPadding";
import {makeStyle} from "../../theming";
import useSelectedAccount from "../../hooks/useSelectedAccount";
import {AirdropApi} from "../../api/AirdropApi";
import useCheckPendingRewards from "../../hooks/useCheckPendingRewards";
import useShowModal from "../../hooks/useShowModal";
import {SingleButtonModal} from "../../modals/SingleButtonModal";


export type Props = StackScreenProps<AirdropScreensStackParams, "AirdropClaimRewards">

export const AirdropClaimRewards: React.FC<Props> = ({navigation, route}) => {
    const {t} = useTranslation();
    const styles = useStyles();
    const account = useSelectedAccount();
    const [claimingRewards, setClaimingRewards] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const pendingRewards = useCheckPendingRewards(route.params.address, account.address);
    const showModal = useShowModal();

    const showSuccessModal = useCallback(() => {
        showModal(SingleButtonModal, {
            image: require("../../assets/result-sucess-light.png"),
            title: t("congratulations!"),
            message: t("you have claimed amount", {
                amount: `${pendingRewards.toBeClaimed} DSM`
            }),
            actionLabel: t("claim more"),
            action: () => navigation.goBack(),
        })
    }, [navigation, pendingRewards.toBeClaimed, showModal, t]);

    const showErrorModal = useCallback((error: string) => {
        showModal(SingleButtonModal, {
            image: require("../../assets/result-fail-light.png"),
            title: t("fail"),
            message: error,
            actionLabel: t("try again"),
            action: () => setError(null),
        })
    }, [showModal, t]);

    const claimRewards = useCallback(async () => {
        setClaimingRewards(true);
        setError(null);
        try {
            await AirdropApi.claimAirdrop(account.address);
            showSuccessModal();
        } catch (e) {
            setError(e.toString());
            showErrorModal(e.toString());
        }
        setClaimingRewards(false);
    }, [account.address, showErrorModal, showSuccessModal])


    return <StyledSafeAreaView
        topBar={<TopBar
            stackProps={{navigation}}
            title={t("Claim DSM Airdrop")}
            capitalizeTitle={false}
        />}
    >
        <Typography.Body1>
            {t("looks like you are allowed to claim")}
        </Typography.Body1>

        <Typography.H2 style={styles.amount}>
            {pendingRewards.loading ? "..." :
                pendingRewards.available ? `${pendingRewards.toBeClaimed} DSM` : "0 DSM"}
        </Typography.H2>

        <FlexPadding flex={1} />
        <Button
            mode="contained"
            onPress={claimRewards}
            loading={claimingRewards}
            disabled={claimingRewards || error !== null || !pendingRewards.available}
        >
            {t("claim now")}
        </Button>
    </StyledSafeAreaView>
}

const useStyles = makeStyle(_ => ({
    amount: {
        alignSelf: "center"
    }
}))