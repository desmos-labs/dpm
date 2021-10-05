import {ModalComponent, RootStackParams} from "../types/navigation";
import {useNavigation} from "@react-navigation/native";
import {useCallback} from "react";
import {StackNavigationProp} from "@react-navigation/stack";

/**
 * Hook that provide a function to display a ModalComponent.
 */
export default function useShowModal() {
    const navigation = useNavigation<StackNavigationProp<RootStackParams>>();

    return useCallback(<P>(modal: ModalComponent<P>, params: P) => {
        navigation.navigate({
            name: "ModalScreen",
            params: {
                component: modal,
                params: params
            }
        })
    }, [navigation])
}