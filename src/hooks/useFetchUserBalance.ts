import {useEffect, useState} from "react";
import {Coin} from "cosmjs-types/cosmos/base/v1beta1/coin";
import {useCurrentChainInfo, useDesmosClient} from "@desmoslabs/sdk-react";
import {convertCoin} from "@desmoslabs/sdk-core";

/**
 * Hook to fetches an account balance.
 * @param address - Address of the account of interest.
 */
export default function useFetchUserBalance(address: string) {
    const chainInfo = useCurrentChainInfo();
    const [userBalance, setUserBalance] = useState<Coin>({
        amount: "0",
        denom: chainInfo.coinDenom,
    });
    const client = useDesmosClient();

    useEffect(() => {
        (async () => {
            setUserBalance({
                amount: "0",
                denom: chainInfo.coinDenom,
            });
            try {
                await client.connect();
                const chainBalance = await client.getBalance(address, chainInfo.coinDenom);
                const balance = convertCoin(chainBalance, 6, chainInfo.denomUnits);
                if (balance !== null) {
                    setUserBalance(balance);
                } else {
                    setUserBalance(chainBalance);
                }
            } catch (e) {
                // Ignore network error and account not present
                // on the chain
            }
        })()
    }, [address, client, chainInfo])

    return userBalance;
}