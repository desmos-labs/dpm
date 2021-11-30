import {useCallback, useEffect, useState} from "react";
import {AirdropApi} from "../api/AirdropApi";
import {useNavigation} from "@react-navigation/native";

export enum FeeGrantStatus {
    Claimed,
    Claimable,
    Error,
}

type FeeGrantRequestClaimed = {
    type: FeeGrantStatus.Claimed,
    hasEnoughDsm: boolean,
}

type FeeGrantRequestClaimable = {
    type: FeeGrantStatus.Claimable
}

type FeeGrantRequestError = {
    type: FeeGrantStatus.Error,
    error: string
}

export type FeeGrantRequest = FeeGrantRequestClaimed | FeeGrantRequestClaimable | FeeGrantRequestError;

export default function useFeeGrantStatus(desmosAddress: string, externalAddress: string) {
    const [loading, setLoading] = useState(true);
    const [feeGrantRequestStatus, setFeeGrantRequestStatus] = useState<FeeGrantRequest | undefined>(undefined);
    const navigation = useNavigation();

    const fetchStatus = useCallback((async () => {
        setLoading(true);
        setFeeGrantRequestStatus(undefined);
        try {
            const result = await AirdropApi.feeGrantStatus(desmosAddress, externalAddress);
            if (!result.canGetGrant) {
                if (result.hasEnoughDsm) {
                    setFeeGrantRequestStatus({
                        type: FeeGrantStatus.Claimed,
                        hasEnoughDsm: result.hasEnoughDsm,
                    })
                }
                else {
                    setFeeGrantRequestStatus({
                        type: FeeGrantStatus.Error,
                        error: `Can't get grant with ${externalAddress} on ${desmosAddress}`,
                    })
                }
            } else if (result.canClaimAirdrop) {
                setFeeGrantRequestStatus({
                    type: FeeGrantStatus.Error,
                    error: `Claim the pending rewards`,
                })
            } else if (result.hasRequestedGrant &&
                result.usedDesmosAddress !== undefined &&
                result.usedDesmosAddress !== desmosAddress) {
                setFeeGrantRequestStatus({
                    type: FeeGrantStatus.Error,
                    error: `Grant already request on ${result.usedDesmosAddress}`,
                });
            } else {
                setFeeGrantRequestStatus({
                    type: FeeGrantStatus.Claimable,
                })
            }
        } catch (e) {
            setFeeGrantRequestStatus({
                type: FeeGrantStatus.Error,
                error: e.toString(),
            })
        }
        setLoading(false);
    }), [desmosAddress, externalAddress]);

    useEffect(() => {
        return navigation.addListener("focus", fetchStatus);
    }, [fetchStatus, navigation]);

    return {
        loading,
        feeGrantRequestStatus
    }
}