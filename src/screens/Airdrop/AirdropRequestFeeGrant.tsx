import React, {useEffect, useMemo, useState} from "react";
import {StackScreenProps} from "@react-navigation/stack";
import {AirdropScreensStackParams} from "../../types/navigation";
import {StyledSafeAreaView} from "../../components";
import {AirdropApi, FeeGrantStatus} from "../../api/AirdropApi";
import usePoolFeeGrantStatus from "../../hooks/usePoolFeeGrantStatus";


export type Props = StackScreenProps<AirdropScreensStackParams, "AirdropRequestFeeGrant">;

export const AirdropRequestFeeGrant: React.FC<Props> = ({navigation, route}) => {
    const {desmosAddress, externalAddress, request} = route.params;
    const {loading, status, startPool} = usePoolFeeGrantStatus(desmosAddress, externalAddress);
    const [requestingGrant, setRequestingGrant] = useState(false);
    const [grantRequestError, setGrantRequestError] = useState<string | undefined>(undefined);

    const gettingGrant = useMemo(() => {
        return requestingGrant || loading || status?.status === FeeGrantStatus.Pending;
    }, [loading, requestingGrant, status])

    const error = useMemo(() => {
        if (grantRequestError !== undefined) {
            return grantRequestError;
        } else if (!loading && status?.status === FeeGrantStatus.Fail) {
            return status!.message;
        } else {
            return undefined;
        }
    }, [grantRequestError, loading, status]);

    useEffect(() => {
        if (request) {
            (async () => {
                setRequestingGrant(true);
                try {
                    await AirdropApi.requestFeeGrant(externalAddress, desmosAddress);
                    startPool();
                } catch (e) {
                    setGrantRequestError(e.toString());
                }
                setRequestingGrant(false)
            })()
        } else {
            startPool();
        }
    }, [desmosAddress, externalAddress, request, startPool]);

    return <StyledSafeAreaView>

    </StyledSafeAreaView>
}