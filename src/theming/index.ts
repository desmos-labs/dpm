import {useTheme} from "react-native-paper";
import {StyleSheet} from "react-native";
import NamedStyles = StyleSheet.NamedStyles;
export * from "./theme"

export function makeStyle<
    T extends NamedStyles<T> | NamedStyles<any>
>(styleProvider: (theme: ReactNativePaper.Theme) => T): () => T {
    return () => {
        const theme = useTheme();
        return StyleSheet.create(styleProvider(theme));
    };
}