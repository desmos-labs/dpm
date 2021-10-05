import {useNavigation} from "@react-navigation/native";
import {AccountScreensStackParams} from "../types/navigation";
import {StackNavigationProp} from "@react-navigation/stack";
import {useCallback} from "react";
import LocalWallet from "../wallet/LocalWallet";

/**
 * Hooks that provides a function to unlock and access the user wallet.
 */
export default function useUnlockWallet(): (address: string) => Promise<LocalWallet | null> {

    const navigation = useNavigation<StackNavigationProp<AccountScreensStackParams>>();

    return useCallback(async (address: string) => {
        return await (new Promise((resolve, reject) => {
            navigation.navigate({
                name: "UnlockWallet",
                params: {
                    address,
                    resolve,
                    reject,
                }
            })
        }));
    }, [navigation])

}