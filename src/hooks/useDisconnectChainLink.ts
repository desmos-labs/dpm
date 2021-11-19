import {useCurrentChainInfo} from "@desmoslabs/sdk-react";
import {useCallback} from "react";
import {ChainLink} from "../types/link";
import LocalWallet from "../wallet/LocalWallet";
import {MsgUnlinkChainAccountEncodeObject} from "@desmoslabs/sdk-core";
import {computeTxFees, messagesGas} from "../types/fees";
import useBroadcastMessages from "./useBroadcastMessages";

export default function useDisconnectChainLink() {
    const chainInfo = useCurrentChainInfo();
    const broadcastMessages = useBroadcastMessages()

    return useCallback(async (wallet: LocalWallet, chainLink: ChainLink) => {
        const msgs = [{
            typeUrl: "/desmos.profiles.v1beta1.MsgUnlinkChainAccount",
            value: {
                chainName: chainLink.chainName,
                owner: wallet.bech32Address,
                target: chainLink.externalAddress
            }
        } as MsgUnlinkChainAccountEncodeObject];

        const gas = messagesGas(msgs);
        const fee = computeTxFees(gas, chainInfo.coinDenom).average;
        await broadcastMessages(wallet, msgs, fee);

    }, [broadcastMessages, chainInfo])
}