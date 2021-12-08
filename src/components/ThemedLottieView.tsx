import React, {useMemo} from "react";
import LottieView from "lottie-react-native";
import {useTheme} from "react-native-paper";


export type DesmosAnimations = "broadcast-tx"

type Props = Omit<React.ComponentProps<typeof LottieView>, "source"> & {
    source: DesmosAnimations
}

export const ThemedLottieView: React.FC<Props> = (props) => {
    const theme = useTheme();
    const animation = useMemo(() => {
        switch (props.source) {
            case "broadcast-tx":
                return theme.dark ? require("../assets/animations/broadcast-tx-dark.json") :
                    require("../assets/animations/broadcast-tx-light.json")
            default:
                throw new Error(`Unknown animation ${props.source}`)
        }
    }, [theme, props.source]);

    return <LottieView
        {...props}
        source={animation}
    />
}