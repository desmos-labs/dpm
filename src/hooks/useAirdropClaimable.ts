import {useEffect, useState} from "react";

export default function useAirdropClaimable(): boolean {
    const [claimable, setClaimable] = useState(false);

    useEffect(() => {
        (async () => {
            const response = await fetch('https://test-api.airdrop.desmos.network/config');
            const jsonResponse = await response.json();
            setClaimable(jsonResponse["airdrop_enabled"] === true || __DEV__);
        })()
    }, []);

    return claimable;
}