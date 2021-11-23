import {useGetChainLinkByAddress} from "../types";
import {useState} from "react";
import {ChainLink} from "../../types/link";

export default function useFetchChainLink(address: string) {
    const [loading, setLoading] = useState(true);
    const [chainLinks, setChainLinks] = useState<ChainLink[]>([]);
    const [error, setError] = useState<string | null>(null);

    useGetChainLinkByAddress({
        pollInterval: 500,
        variables: {
            address: address,
        },
        onCompleted: ({chain_link}) => {
            const chainLinks = chain_link.map(link => {
                return {
                    chainName: link.chain_config.name,
                    externalAddress: link.external_address,
                    userAddress: link.user_address,
                    creationTime: new Date(link.creation_time + "Z"),
                } as ChainLink
            });
            setChainLinks(chainLinks);
            setError(null);
            setLoading(false);
        },
        onError: error => {
            console.error(error);
            setChainLinks([]);
            setError(error.toString());
            setLoading(false);
        }
    });

    return {
        loading,
        chainLinks,
        error,
    }
}