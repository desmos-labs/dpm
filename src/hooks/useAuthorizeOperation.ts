import {CompositeNavigationProp, useNavigation} from "@react-navigation/native";
import {AccountScreensStackParams, AuthorizeOperationResolveParams, RootStackParams} from "../types/navigation";
import {StackNavigationProp} from "@react-navigation/stack";
import {useCallback} from "react";
import {ChainAccount} from "../types/chain";

type NavigationProps = CompositeNavigationProp<StackNavigationProp<AccountScreensStackParams>,
    StackNavigationProp<RootStackParams>>

/**
 * Hooks that provides a function that request the user to
 * input the password that has been used to secure the account.
 */
export default function useAuthorizeOperation(): (account: ChainAccount) => Promise<boolean> {

    const navigation = useNavigation<NavigationProps>();

    return useCallback(async (account: ChainAccount) => {
        return await (new Promise((resolve, reject) => {
            navigation.navigate({
                name: "AuthorizeOperation",
                params: {
                    address: account.address,
                    provideWallet: false,
                    resolve: (result: AuthorizeOperationResolveParams) => {
                        resolve(result.authorized);
                    },
                    reject,
                }
            })
        }));
    }, [navigation])

}