import {useCallback} from "react";
import {useNavigation} from "@react-navigation/native";
import {StackNavigationProp} from "@react-navigation/stack/lib/typescript/src/types";
import {RootStackParams} from "../types/navigation";

export default function useNavigateToHomeScreen() {
    const navigation = useNavigation<StackNavigationProp<RootStackParams>>()

    return useCallback((reset?: boolean) => {
        if (reset === true) {
            const state = navigation.getState();
            const key = state?.routes.find(r => r.name === "AccountScreens")?.key;
            navigation.reset({
                index: 0,
                routes: [{
                    name: "AccountScreens",
                    key
                }],
            })
        } else {
            navigation.navigate({
                name: "AccountScreens",
                params: undefined
            })
        }
    }, [navigation])
}