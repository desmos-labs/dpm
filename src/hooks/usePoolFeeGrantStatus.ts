import {useCallback, useEffect, useState} from "react";
import {AirdropApi, FeeGrantRequestStatus, FeeGrantStatus} from "../api/AirdropApi";


export default function usePoolFeeGrantStatus(desmosAddress: string, externalAddress: string) {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<FeeGrantRequestStatus | undefined>(undefined);
    const [interval, setRunningInterval] = useState<NodeJS.Timer | undefined>(undefined)

    const startPool = useCallback(() => {
        const fetchStatus = (async () => {
            setLoading(true);
            setStatus(undefined);
            try {
                const result = await AirdropApi.feeGrantStatus(desmosAddress, externalAddress);
                if (result.status === FeeGrantStatus.Allowed) {
                    setRunningInterval(undefined);
                }
                setStatus(result);
            } catch (e) {
                setStatus({
                    status: FeeGrantStatus.Fail,
                    message: e.toString(),
                })
            }
            setLoading(false);
        })
        setRunningInterval(setInterval(fetchStatus, 5000));
    }, [desmosAddress, externalAddress])

    useEffect(() => {
        return () => {
            if (interval !== undefined) {
                clearInterval(interval)
            }
        }
    }, [interval]);

    return {
        loading,
        status,
        startPool,
    }
}