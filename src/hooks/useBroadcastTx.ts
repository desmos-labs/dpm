import {useNavigation} from "@react-navigation/native";
import {AccountScreensStackParams} from "../types/navigation";
import {StackNavigationProp} from "@react-navigation/stack";
import {useCallback} from "react";
import {EncodeObject} from "@cosmjs/proto-signing";
import ChainAccount from "../types/chainAccount";

/**
 * Hooks that provides a function that sign and broadcast a transaction.
 * The returned function shows to the user the transaction that will be broadcasted.
 */
export default function useBroadcastTx(): (signer: ChainAccount, msgs: EncodeObject[]) => Promise<void> {

    const navigation = useNavigation<StackNavigationProp<AccountScreensStackParams>>();

    return useCallback(async (signer: ChainAccount, msgs: EncodeObject[]) => {
        return await (new Promise((resolve, reject) => {
            navigation.navigate({
                name: "BroadcastTx",
                params: {
                    signer,
                    msgs,
                    onSuccess: resolve,
                    onCancel: reject
                }
            })
        }));
    }, [navigation])

}