import {useEffect, useState} from "react";
import {AirdropApi} from "../api/AirdropApi";
import useSelectedAccount from "./useSelectedAccount";
import {useCurrentChainInfo, useDesmosClient} from "@desmoslabs/sdk-react";
import Long from "long";

export default function useAirdropFeeGrant(desmosAddress: string, externalAddress: string) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<null | string>(null);
    const [feeGrantStatus, setFeeGrantStatus] = useState(false);
    const [feeGranter, setFeeGranter] = useState<string | undefined>(undefined);
    const account = useSelectedAccount();
    const desmosClient = useDesmosClient();
    const chainInfo = useCurrentChainInfo();

    useEffect(() => {
        (async () => {
            setLoading(true);
            setError(null);
            setFeeGrantStatus(false);
            try {
                const config = await AirdropApi.config();
                await desmosClient.connect();
                const balance = await desmosClient.getBalance(account.address, chainInfo.coinDenom).catch(_ => null);
                if (balance === null || Long.fromString(balance.amount).eq(Long.ZERO)) {
                    await AirdropApi.requestFeeGrant(externalAddress, desmosAddress);
                    setFeeGranter(config.feeGranter);
                } else {
                    setFeeGranter(undefined);
                }
                setFeeGrantStatus(true);
            } catch (e) {
                setError(e.toString());
            }
            setLoading(false);
        })()
    }, [account.address, chainInfo.coinDenom, desmosAddress, desmosClient, externalAddress]);

    return {
        loading,
        error,
        feeGrantStatus,
        feeGranter,
    }
}