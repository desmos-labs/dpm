import {useCallback, useState} from "react";
import {AirdropApi} from "../api/AirdropApi";
import useChainLinks from "./useChainLinks";

export default function useCheckPendingRewards(desmosAddress: string) {
    const [loading, setLoading] = useState(true);
    const [available, setAvailable] = useState(false);
    const [toBeClaimed, setToBeClaimed] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const chainLinks = useChainLinks(desmosAddress);

    const updatePendingRewards = useCallback(async () => {
        setLoading(true);
        setError(null);
        setAvailable(false);
        let total = 0;
        for (let link of chainLinks) {
            const allocations = await AirdropApi.fetchAllottedDsm(link.externalAddress);
            let linkChainName = link.chainName === "cro" ? "crypto.com" : link.chainName.toLowerCase()
            const toBeClaimed = allocations.allocations.filter(allocation =>
                !allocation.claimed &&
                allocation.chainName.toLowerCase() === linkChainName);
            total = toBeClaimed.reduce((previousValue, currentValue) => {
                return previousValue + currentValue.amount
            }, total);
        }
        setAvailable(total > 0);
        setToBeClaimed(total);
        setLoading(false);
    }, [chainLinks]);

    return {
        updatePendingRewards,
        loading,
        available,
        toBeClaimed,
        error,
    }
}