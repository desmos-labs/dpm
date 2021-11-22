import React from "react";
import {StyleProp, ViewStyle, ImageBackground, TouchableOpacity, StyleSheet} from "react-native";

export type Props = {
    onClaimPressed: () => void,
    visible: boolean,
    style?: StyleProp<ViewStyle>,
}

export const AirdropBanner: React.FC<Props> = ({visible, style, onClaimPressed}) => {
    return visible ? (<TouchableOpacity
        style={style}
        onPress={onClaimPressed}
    >
        <ImageBackground
            source={require("../assets/airdrop_claimable.png")}
            resizeMethod="resize"
            style={styles.backgroundImage}
        />
    </TouchableOpacity>) : null
}

const styles = StyleSheet.create({
    backgroundImage: {
        width: "100%",
        height: "100%",
    }
})