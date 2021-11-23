import {useAppContext} from "../contexts/AppContext";
import {useCallback} from "react";

export default function useRemoveChainLink(address: string) {
    const {setChainLinks} = useAppContext();

    return useCallback((toRemove: {
        externalAddress: string,
        chainName: string,
    }) => {
        setChainLinks(old => {
            const currentLinks = old[address] ?? [];
            const index = currentLinks.findIndex(link =>
                link.externalAddress === toRemove.externalAddress &&
                link.chainName === toRemove.chainName,
            )
            if (index >= 0) {
                currentLinks.splice(index, 1);
                const newState = {
                    ...old,
                }
                newState[address] = [...currentLinks];
                return newState;
            } else {
                return old;
            }
        })
    }, [address, setChainLinks])
}