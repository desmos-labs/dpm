import React from "react";
import {Image, ImageBackground, StyleSheet} from "react-native";

export const SplashScreen: React.FC = (_props) => {
    return <ImageBackground
        style={styles.root}
        source={require("../assets/splashscreen_background.png")}
        resizeMode="cover"
    >
        <Image source={require("../assets/desmos-icon.png")}/>
    </ImageBackground>
}

const styles = StyleSheet.create({
    root: {
        display: "flex",
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center"
    },
})