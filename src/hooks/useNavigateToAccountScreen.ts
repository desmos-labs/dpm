import {useCallback} from "react";
import {useNavigation} from "@react-navigation/native";
import {StackNavigationProp} from "@react-navigation/stack/lib/typescript/src/types";
import {RootStackParams} from "../types/navigation";
import {ChainAccount} from "../types/chain";

export default function useNavigateToAccountScreen() {
    const navigation = useNavigation<StackNavigationProp<RootStackParams>>()

    return useCallback((account: ChainAccount, reset?: boolean) => {
        if (reset === true) {
            navigation.reset({
                index: 0,
                routes: [{
                    name: "AccountScreens",
                    params: {
                        account
                    }
                }]
            })
        } else {
            navigation.navigate({
                name: "AccountScreens",
                params: {
                    account
                }
            })
        }
    }, [navigation])
}