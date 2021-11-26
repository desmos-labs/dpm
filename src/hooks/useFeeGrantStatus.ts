import {useCallback, useEffect, useState} from "react";
import {AirdropApi, FeeGrantStatus} from "../api/AirdropApi";
import {useNavigation} from "@react-navigation/native";

export default function useFeeGrantStatus(desmosAddress: string, externalAddress: string) {
    const [loading, setLoading] = useState(true);
    const [feeGranter, setFeeGranter] = useState<string | undefined>(undefined);
    const [status, setStatus] = useState<FeeGrantStatus>(FeeGrantStatus.NotRequested);
    const [message, setMessage] = useState<string | undefined>(undefined);
    const navigation = useNavigation();

    const fetchStatus = useCallback((async () => {
        setLoading(true);
        try {
            const result = await AirdropApi.feeGrantStatus(desmosAddress, externalAddress);
            if (result.status === FeeGrantStatus.Allowed) {
                const config = await AirdropApi.config();
                setFeeGranter(config.feeGranter);
            }
            else {
                setStatus(result.status);
            }
            setStatus(result.status);
            setMessage(result.message);
        } catch (e) {
            setStatus(FeeGrantStatus.Fail);
            setMessage(e.toString());
        }
        setLoading(false);
    }), [desmosAddress, externalAddress]);

    useEffect(() => {
        return navigation.addListener("focus", fetchStatus);
    }, [fetchStatus, navigation]);

    return {
        loading,
        feeGranter,
        feeGrantStatus: status,
        feeGrantMessage: message
    }
}