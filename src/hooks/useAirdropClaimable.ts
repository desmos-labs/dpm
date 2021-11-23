import {useEffect, useState} from "react";
import {AirdropApi} from "../api/AirdropApi";

export default function useAirdropClaimable(): boolean {
    const [claimable, setClaimable] = useState(false);

    useEffect(() => {
        (async () => {
            const config = await AirdropApi.config();
            setClaimable(config.airdropEnabled || __DEV__);
        })()
    }, []);

    return claimable;
}