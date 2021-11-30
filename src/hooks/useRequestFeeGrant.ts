import {useCallback, useEffect, useState} from "react";
import {AirdropApi} from "../api/AirdropApi";


export default function useRequestFeeGrant(desmosAddress: string, externalAddress: string) {
    const [issued, setIssued] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const [interval, setRunningInterval] = useState<NodeJS.Timer | undefined>(undefined)

    const startPool = useCallback(() => {
        const fetchStatus = (async () => {
            try {
                const result = await AirdropApi.feeGrantStatus(desmosAddress, externalAddress);
                if (result.hasEnoughDsm) {
                    setRunningInterval(undefined);
                }
                setIssued(result.hasEnoughDsm);
            } catch (e) {
                setError(e.toString());
                setRunningInterval(undefined);
            }
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

    useEffect(() => {
        (async () => {
            try {
                const result = await AirdropApi.feeGrantStatus(desmosAddress, externalAddress);
                if (result.hasEnoughDsm) {
                    setIssued(true)
                } else if (result.hasRequestedGrant &&
                    result.usedDesmosAddress !== undefined &&
                    result.usedDesmosAddress !== desmosAddress) {
                    setError(`Grant already requested on ${result.usedDesmosAddress}`)
                } else {
                    setIssued(false);
                    if (!result.hasRequestedGrant) {
                        await AirdropApi.requestFeeGrant(externalAddress, desmosAddress);
                    }
                    startPool();
                }
            } catch (e) {
                setError(e.toString());
            }
        })()
    }, [desmosAddress, externalAddress, startPool]);

    return {
        issued,
        error,
    }
}