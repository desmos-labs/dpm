import {useEffect, useState} from "react";
import {AirdropApi, Allocation} from "../api/AirdropApi";


/**
 * Hook that provides the amount of DSM that have been allotted to a user.
 */
export default function useFetchAllottedDsm(externalAddress: string) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>();
    const [allottedCoins, setAllottedCoins] = useState(0);
    const [allocations, setAllocations] = useState<Allocation[]>([]);

    useEffect(() => {
        (async () => {
            setLoading(true);
            setError(null);
            setAllocations([]);
            setAllottedCoins(0);
            try {
                const allottedDsm = await AirdropApi.fetchAllottedDsm(externalAddress);
                setAllottedCoins(allottedDsm.total);
                setAllocations(allottedDsm.allocations);
            } catch (e) {
                setError(e.toString())
            }
            setLoading(false);
        })()
    }, [externalAddress]);

    return {
        loading,
        error,
        allocations,
        allottedCoins,
    }
}